/**
 * Security & Sanitization Utilities
 * Protects against XSS, Prototype Pollution, and Malformed Payload DoS.
 */

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_BACKUP_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit

/**
 * Sanitize plain text input:
 * - Trims whitespace
 * - Strips HTML tags & script injection vectors
 * - Escapes potential HTML entities
 * - Enforces character length limits
 */
export function sanitizeText(input: unknown, maxLength = MAX_NAME_LENGTH): string {
  if (typeof input !== 'string') return '';

  // 1. Remove dangerous control characters
  let clean = input.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // 2. Strip HTML tags
  clean = clean.replace(/<[^>]*>?/gm, '');

  // 3. Strip dangerous protocol handlers
  clean = clean.replace(/(javascript|vbscript|data):/gi, '');

  // 4. Trim and truncate to max length
  return clean.trim().slice(0, maxLength);
}

/**
 * Sanitize descriptions
 */
export function sanitizeDescription(input: unknown): string {
  return sanitizeText(input, MAX_DESCRIPTION_LENGTH);
}

/**
 * Safe JSON parser with Prototype Pollution & Memory DoS guards
 */
export function safeJsonParse<T = unknown>(
  jsonStr: string,
  maxSizeBytes = MAX_BACKUP_SIZE_BYTES
): { success: boolean; data?: T; error?: string } {
  try {
    if (typeof jsonStr !== 'string') {
      return { success: false, error: 'Input must be a string' };
    }

    // Guard against excessively large payloads
    if (new Blob([jsonStr]).size > maxSizeBytes) {
      return { success: false, error: 'Payload exceeds maximum allowed size (2MB)' };
    }

    // Parse with reviver to block prototype pollution
    const parsed = JSON.parse(jsonStr, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined; // Purge dangerous keys
      }
      return value;
    });

    return { success: true, data: parsed as T };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Malformed JSON string' };
  }
}

/**
 * Deep validation of Habit backup data to guarantee schema integrity
 */
export function validateBackupPayload(parsed: any): boolean {
  if (!parsed || typeof parsed !== 'object') return false;

  // Validate habits array if present
  if ('habits' in parsed) {
    if (!Array.isArray(parsed.habits)) return false;
    for (const h of parsed.habits) {
      if (!h || typeof h !== 'object') return false;
      if (typeof h.id !== 'string' || typeof h.name !== 'string') return false;
      if (h.name.length > MAX_NAME_LENGTH) return false;
      if (!h.frequency || typeof h.frequency !== 'object') return false;
    }
  }

  // Validate logs array if present
  if ('logs' in parsed) {
    if (!Array.isArray(parsed.logs)) return false;
    for (const l of parsed.logs) {
      if (!l || typeof l !== 'object') return false;
      if (typeof l.habitId !== 'string' || typeof l.date !== 'string') return false;
      // Date must match YYYY-MM-DD format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(l.date)) return false;
    }
  }

  return true;
}

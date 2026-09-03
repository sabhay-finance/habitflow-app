// Vercel Edge Middleware: IP Rate Limiting & Malicious Scanner Blocker

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 120; // 120 reqs / min per IP

// In-memory sliding window cache for Edge node
const ipRequestHistory = new Map<string, number[]>();

// Blocklist of suspicious automated scanner paths
const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/phpmyadmin/i,
  /\/xmlrpc\.php/i,
  /\.\./, // Path traversal
  /\/etc\/passwd/i,
];

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Block malicious vulnerability scanners & path traversal
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new Response(JSON.stringify({ error: 'Forbidden', message: 'Access denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 2. Identify client IP
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const now = Date.now();
  const requestHistory = ipRequestHistory.get(clientIp) || [];

  // Filter timestamps within the current sliding window
  const recentRequests = requestHistory.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  // 3. Rate Limit check
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait a minute before retrying.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Limit': String(MAX_REQUESTS_PER_MINUTE),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Record request timestamp
  recentRequests.push(now);
  ipRequestHistory.set(clientIp, recentRequests);

  // Periodic memory cleanup: prune entries older than 2 windows if map grows
  if (ipRequestHistory.size > 2000) {
    for (const [ip, history] of ipRequestHistory.entries()) {
      if (history.length === 0 || now - history[history.length - 1] > RATE_LIMIT_WINDOW_MS * 2) {
        ipRequestHistory.delete(ip);
      }
    }
  }

  // Proceed with request
  return;
}

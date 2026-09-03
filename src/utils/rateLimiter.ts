/**
 * Client-side Sliding Window Action Rate Limiter
 * Protects against macro spam, audio thread lockups, and rapid state corruption.
 */

interface RateLimitConfig {
  maxOperations: number;
  windowMs: number;
}

class ActionRateLimiter {
  private timestamps: Map<string, number[]> = new Map();

  /**
   * Checks if an action key is permitted under the rate limit.
   * Returns true if allowed, false if rate limited.
   */
  public checkLimit(actionKey: string, config: RateLimitConfig = { maxOperations: 5, windowMs: 1000 }): boolean {
    const now = Date.now();
    const history = this.timestamps.get(actionKey) || [];

    // Filter out timestamps outside current sliding window
    const recent = history.filter((t) => now - t < config.windowMs);

    if (recent.length >= config.maxOperations) {
      return false; // Rate limit exceeded
    }

    recent.push(now);
    this.timestamps.set(actionKey, recent);
    return true;
  }

  /**
   * Resets limits for a key
   */
  public reset(actionKey: string): void {
    this.timestamps.delete(actionKey);
  }
}

export const actionRateLimiter = new ActionRateLimiter();

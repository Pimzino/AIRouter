/**
 * In-memory rate limiter using sliding window algorithm
 *
 * Features:
 * - No external dependencies (works with Next.js standalone build)
 * - Automatic cleanup of expired entries
 * - Configurable window and attempt limits
 */

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
    this.maxAttempts = options.maxAttempts || 5;
    this.store = new Map(); // key -> { attempts: number[] }

    // Cleanup interval to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000);

    // Prevent interval from keeping process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Check if request should be allowed
   * @param {string} key - Rate limit key (e.g., "login:192.168.1.1")
   * @returns {{ allowed: boolean, remaining: number, resetTime: number, retryAfter?: number }}
   */
  check(key) {
    const now = Date.now();
    const record = this.store.get(key) || { attempts: [] };

    // Filter out expired attempts (outside window)
    record.attempts = record.attempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    // Check attempt count
    if (record.attempts.length >= this.maxAttempts) {
      // Calculate when the oldest attempt expires
      const oldestAttempt = Math.min(...record.attempts);
      const resetTime = oldestAttempt + this.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      };
    }

    return {
      allowed: true,
      remaining: this.maxAttempts - record.attempts.length,
      resetTime: now + this.windowMs,
    };
  }

  /**
   * Record an attempt (call after check, only on failed login)
   * @param {string} key - Rate limit key
   */
  recordAttempt(key) {
    const record = this.store.get(key) || { attempts: [] };
    record.attempts.push(Date.now());
    this.store.set(key, record);
  }

  /**
   * Clear attempts for a key (call on successful login)
   * @param {string} key - Rate limit key
   */
  reset(key) {
    this.store.delete(key);
  }

  /**
   * Cleanup expired entries to prevent memory leaks
   */
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      record.attempts = record.attempts.filter(
        (timestamp) => now - timestamp < this.windowMs
      );
      if (record.attempts.length === 0) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Destroy the limiter (cleanup interval)
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance for login rate limiting
// 5 attempts per 15 minutes
export const loginRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5,
});

export default RateLimiter;

/**
 * Extract real client IP from request
 * Handles various proxy scenarios (dokploy/traefik, nginx, cloudflare, etc.)
 *
 * Priority order:
 * 1. CF-Connecting-IP (Cloudflare)
 * 2. X-Real-IP (nginx)
 * 3. X-Forwarded-For (first IP in chain)
 * 4. Fallback to 'unknown'
 */

export function getClientIp(request) {
  // Cloudflare
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Nginx / Generic proxy
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  // X-Forwarded-For (may contain multiple IPs: client, proxy1, proxy2)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (original client)
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  return "unknown";
}

/**
 * Generate a rate limit key from IP
 * Prefixed to allow multiple rate limiters
 */
export function getRateLimitKey(request, prefix = "login") {
  const ip = getClientIp(request);
  return `${prefix}:${ip}`;
}

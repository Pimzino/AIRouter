# Changelog

## v0.2.22 (2026-01-14)

### Security
- Add rate limiting to login endpoint (5 attempts per 15 minutes per IP)
- Protect sensitive API routes (`/api/settings`, `/api/providers`, `/api/keys`, `/api/combos`, `/api/shutdown`, `/api/sync`, `/api/pricing`) with authentication
- Add input validation to login endpoint
- Add `maxAge` to auth cookies for proper expiration

### Docker
- Add multi-stage Dockerfile for optimized production builds (~150MB image)
- Add docker-compose.yml for easy deployment
- Add .dockerignore and health check endpoint
- Add `DATA_DIR` environment variable support for Docker volume mounting

### Documentation
- Update README with Docker/VPS deployment guides
- Add security best practices and environment variables docs
- Rebrand from 9Router to AIRouter

---

## v0.2.21 (2026-01-12)

### Changes
- Update ReadMe
- Fix bug **antigravity**

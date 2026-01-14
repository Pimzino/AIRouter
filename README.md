# 🚀 9ROUTER - AI Proxy

> Universal AI Proxy for Claude Code, Codex, Cursor | OpenAI, Claude, Gemini, Copilot

🌐 **Website: [9router.com](https://9router.com)**

[![npm version](https://img.shields.io/npm/v/9router.svg)](https://www.npmjs.com/package/9router)
[![Downloads](https://img.shields.io/npm/dm/9router.svg)](https://www.npmjs.com/package/9router)
[![License](https://img.shields.io/npm/l/9router.svg)](https://github.com/Pimzino/AIRouter/blob/master/LICENSE)

A JavaScript port of CLIProxyAPI with web dashboard.

![9Router Dashboard](./images/9router.png)

## 📖 Introduction

**9Router** is a powerful AI API proxy server that provides unified access to multiple AI providers through a single endpoint. It features automatic format translation, intelligent fallback routing, OAuth authentication, and a modern web dashboard for easy management.

**Key Highlights:**
- **JavaScript Port**: Converted from CLIProxyAPI (Go) to JavaScript/Node.js.
- **Universal CLI Support**: Works seamlessly with Claude Code, OpenAI Codex, Cline, RooCode, AmpCode, and other CLI tools
- **Cross-Platform**: Runs on Windows, Linux, and macOS
- **Easy Deployment**: Simple installation via npx, Docker, or deploy to VPS

## ✨ Features

### Core Features
- **🔄 Multi-Provider Support**: Unified endpoint for 15+ AI providers (Claude, OpenAI, Gemini, GitHub Copilot, Qwen, iFlow, DeepSeek, Kimi, MiniMax, GLM, etc.)
- **🔐 OAuth & API Key Authentication**: Supports both OAuth2 flow and API key authentication
- **🎯 Format Translation**: Automatic request/response translation between OpenAI, Claude, Gemini, Codex, and Ollama formats
- **🌐 Web Dashboard**: Beautiful React-based dashboard for managing providers, combos, API keys, and settings
- **📊 Usage Tracking**: Real-time monitoring and analytics for all API requests

### Advanced Features
- **🎲 Combo System**: Create model combos with automatic fallback support
- **♻️ Intelligent Fallback**: Automatic account rotation when rate limits or errors occur
- **⚡ Response Caching**: Optimized caching for Claude Code (1-hour cache vs default 5 minutes)
- **🔧 Model Aliases**: Create custom model aliases for easier management
- **☁️ Cloud Deployment**: Deploy to Cloud for Cursor IDE integration with global edge performance

### Security Features
- **🛡️ Rate Limiting**: Login endpoint protected with rate limiting (5 attempts per 15 minutes per IP)
- **🔒 JWT Authentication**: Secure session management with 24-hour token expiry
- **🍪 HTTP-Only Cookies**: Secure cookie configuration with SameSite protection
- **🔑 Protected API Routes**: Sensitive endpoints require authentication

### Format Support
- **OpenAI Format**: Standard OpenAI Chat Completions API
- **Claude Format**: Anthropic Messages API
- **Gemini Format**: Google Generative AI API
- **OpenAI Responses API**: Codex CLI format
- **Ollama Format**: Compatible with Ollama-based tools

### CLI Integration
- Works with: Cursor, Claude Code, OpenAI Codex, Cline, RooCode, AmpCode, and more
- Seamless integration with popular AI coding assistants

## 📦 Install

```bash
# Install globally
npm install -g 9router
9router

# Run directly with npx
npx 9router
```

## 🚀 Quick Start

```bash
9router                    # Start server with default settings
9router --port 8080        # Custom port
9router --no-browser       # Don't open browser
9router --skip-update      # Skip auto-update check
9router --help             # Show help
```

**Dashboard**: `http://localhost:20128/dashboard`

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Clone the repository
git clone https://github.com/Pimzino/AIRouter.git
cd AIRouter

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Docker Build

```bash
# Build the image
docker build -t 9router .

# Run the container
docker run -d \
  --name 9router \
  -p 3000:3000 \
  -e JWT_SECRET=your-secure-secret-here \
  -e NODE_ENV=production \
  -v 9router-data:/app/data \
  9router
```

### Docker Compose Configuration

```yaml
version: "3.8"
services:
  9router:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=your-secure-secret-here
      - NODE_ENV=production
      - DATA_DIR=/app/data
    volumes:
      - 9router-data:/app/data
    restart: unless-stopped

volumes:
  9router-data:
```

## ☁️ VPS Deployment (Dokploy/Coolify)

### Dokploy Deployment

1. **Create Application**: In Dokploy dashboard, create a new application
2. **Connect Repository**: Link your Git repository
3. **Build Method**: Select "Dockerfile" as the build method
4. **Environment Variables**: Configure the following:
   ```
   JWT_SECRET=<generate-a-strong-random-secret>
   NODE_ENV=production
   ```
5. **Persistent Storage**: Add a volume mounted at `/app/data`
6. **Deploy**: Dokploy will build and deploy automatically

### Generate a Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ⚙️ Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | `9router-default-secret-change-me` | **Yes (production)** |
| `NODE_ENV` | Environment mode (`development`/`production`) | `development` | Recommended |
| `PORT` | Server port | `3000` | No |
| `DATA_DIR` | Directory for database storage | `~/.9router` | No (Docker: `/app/data`) |
| `NEXT_PUBLIC_CLOUD_URL` | Cloud sync endpoint | `https://9router.com` | No |

> **Security Note**: Always set a strong, unique `JWT_SECRET` in production. The default secret is insecure and should never be used in public deployments.

## 🔐 Security

### Authentication

The dashboard is protected by password authentication:
- **Default Password**: `123456` (change immediately after first login)
- **Session Duration**: 24 hours
- **Cookie Security**: HTTP-only, Secure (in production), SameSite=Lax

### Rate Limiting

Login attempts are rate-limited to prevent brute-force attacks:
- **Limit**: 5 attempts per 15 minutes per IP
- **Reset**: Counter resets on successful login
- **Headers**: Responses include `X-RateLimit-*` headers

### Protected Endpoints

The following API endpoints require authentication:
- `/api/settings` - Application settings
- `/api/providers` - Provider connections
- `/api/keys` - API key management
- `/api/combos` - Model combos
- `/api/sync` - Cloud sync
- `/api/shutdown` - Server shutdown

### Best Practices for Production

1. **Change Default Password**: Update immediately after first login via Dashboard > Profile
2. **Set JWT_SECRET**: Use a cryptographically secure random string (32+ characters)
3. **Enable HTTPS**: Use a reverse proxy (nginx, Caddy, Traefik) or platform SSL (Dokploy, Coolify)
4. **Firewall**: Restrict access to trusted IPs if possible
5. **Regular Updates**: Keep 9Router updated for security patches

## 💾 Data Location

User data stored at:
- **macOS/Linux**: `~/.9router/db.json`
- **Windows**: `%APPDATA%/9router/db.json`
- **Docker**: `/app/data/db.json` (mount as volume for persistence)

## 🛠️ Development

### Setup
```bash
# Clone repository
git clone https://github.com/Pimzino/AIRouter.git
cd AIRouter

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Project Structure
```
9router/
├── src/
│   ├── app/               # Next.js app (dashboard & API routes)
│   ├── lib/               # Core libraries (DB, OAuth, rate limiting)
│   ├── shared/            # Shared components & utilities
│   └── sse/               # SSE streaming handlers
├── open-sse/              # Core proxy engine (translator, handlers)
│   ├── translator/        # Format translators
│   ├── handlers/          # Request handlers
│   ├── services/          # Core services
│   └── config/            # Provider configurations
├── Dockerfile             # Docker build configuration
├── docker-compose.yml     # Docker Compose setup
└── public/                # Static assets
```

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+ / Bun |
| **Framework** | Next.js 15 |
| **Dashboard** | React 19 + Tailwind CSS 4 |
| **Database** | LowDB (JSON file-based) |
| **CLI** | Node.js CLI with auto-update |
| **Streaming** | Server-Sent Events (SSE) |
| **Auth** | JWT + bcrypt + Rate Limiting |
| **Deployment** | Docker / Standalone / VPS |
| **State Management** | Zustand |

### Core Libraries
- **lowdb**: Lightweight JSON database
- **undici**: High-performance HTTP client
- **jose**: JWT token handling
- **bcryptjs**: Password hashing
- **uuid**: Unique identifier generation
- **open**: Cross-platform browser launcher

## 🙏 Acknowledgments

Special thanks to:

- **CLIProxyAPI**: The original Go implementation that inspired this project. 9Router is a JavaScript port with some features and web dashboard.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

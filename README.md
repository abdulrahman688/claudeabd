# 🌸 Syrian Renaissance Platform (SRP)

> A trauma-informed, mobile-first platform guiding Syrian survivors through a 90-day journey from psychological healing to economic independence.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![React Native](https://img.shields.io/badge/React_Native-0.73+-61DAFB.svg)](https://reactnative.dev)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## 🌟 About

The **Syrian Renaissance Platform** is a comprehensive digital solution designed to support Syrian trauma survivors through:

1. **🕊️ Healing Phase (Days 1-30)**: Psychological support, trauma-informed exercises, and daily rituals guided by "Sham," an AI companion powered by Claude.

2. **📚 Learning Phase (Days 31-60)**: Skill-building modules in high-demand areas (customer service, content writing, translation, etc.)

3. **💰 Earning Phase (Days 61-90)**: Job marketplace connecting users with remote work opportunities and income-generating projects.

### Core Principles

- **Privacy First**: End-to-end encryption, no user tracking, GDPR-compliant
- **Offline-First**: Works in low-connectivity environments
- **Trauma-Informed Design**: Every interaction is safe, warm, and empowering
- **Accessibility**: RTL support (Arabic), high contrast, screen reader compatible
- **Performance**: Fast load times (<3 sec), smooth animations, minimal battery drain

---

## ✨ Features

### For Users

- **Sham AI Companion** 🌸: Compassionate AI assistant providing 24/7 support
- **Daily Rituals**: Guided mindfulness, breathing exercises, and mood tracking
- **Learning Modules**: Interactive courses with videos, quizzes, and certificates
- **Job Marketplace**: Curated remote work opportunities
- **Community Support**: Safe, moderated peer support groups
- **Progress Tracking**: Visual journey map and achievements
- **Multilingual**: Arabic (primary) and English support

### For Administrators

- **Content Management**: Create and manage learning modules
- **User Analytics**: Privacy-preserving insights into platform usage
- **Moderation Tools**: AI-assisted content moderation
- **Crisis Alerts**: Automatic flagging of users in distress

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native** 0.73+ with TypeScript
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **React Native Paper** for UI components
- **i18next** for internationalization

### Backend (API)
- **Node.js** 18+ with Express.js
- **TypeScript** for type safety
- **PostgreSQL** 14+ (primary database)
- **Redis** 7+ (caching & sessions)
- **Prisma ORM** for database management
- **Socket.io** for real-time features

### AI & ML
- **Claude API** (Anthropic) for Sham AI personality
- **Hugging Face** for Arabic NLP tasks

### DevOps
- **Docker** & Docker Compose for containerization
- **GitHub Actions** for CI/CD
- **Winston** for logging
- **Jest** for testing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Screens   │  │  Sham AI UI  │  │  Offline Mode │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express.js)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │   Routes     │  │  Rate Limit  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───┬──────────┬──────────┬──────────┬──────────┬────────┘
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │Content │ │Progress│ │ Sham AI│ │  Jobs  │
│Service │ │Service │ │Service │ │Service │ │Service │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Redis** 7+
- **Docker** and Docker Compose (optional, recommended)
- **Claude API Key** from [Anthropic](https://www.anthropic.com)

### Quick Start with Docker (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/yourorg/srp-platform.git
cd srp-platform
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env and add your CLAUDE_API_KEY and other settings
```

3. **Start all services**

```bash
docker-compose up -d
```

4. **Run database migrations**

```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. **Access the application**

- API: http://localhost:3000
- Health Check: http://localhost:3000/health
- pgAdmin: http://localhost:5050 (admin@srp.com / admin)

### Manual Setup (Without Docker)

#### 1. Install Dependencies

```bash
# Backend
cd backend
npm install
```

#### 2. Set up PostgreSQL

```bash
# Create database
createdb srp_db

# Or using psql
psql -U postgres
CREATE DATABASE srp_db;
\q
```

#### 3. Set up Redis

```bash
# Start Redis (macOS with Homebrew)
brew services start redis

# Start Redis (Linux)
sudo systemctl start redis
```

#### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

#### 5. Run Migrations and Seeds

```bash
cd backend
npm run db:migrate
npm run db:seed
```

#### 6. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## 💻 Development

### Project Structure

```
srp-platform/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema
│   └── tests/              # Test files
├── mobile-app/             # React Native application
├── database/               # Database migrations & seeds
├── docs/                   # Documentation
├── shared/                 # Shared code (types, utils)
├── ai-services/            # AI integrations
├── scripts/                # Deployment & utility scripts
└── docker-compose.yml      # Docker services
```

### Available Scripts

```bash
# Backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (DB GUI)
```

### Code Quality

This project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

```bash
# Lint and fix
npm run lint:fix

# Format all files
npm run format
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Most endpoints require authentication via JWT Bearer token:

```
Authorization: Bearer <your_access_token>
```

### Key Endpoints

#### Authentication

```http
POST   /auth/register        # Register new user
POST   /auth/login           # Login user
POST   /auth/logout          # Logout user
POST   /auth/refresh-token   # Refresh access token
```

#### Users

```http
GET    /users/profile        # Get user profile
PUT    /users/profile        # Update profile
GET    /users/dashboard      # Get user dashboard
GET    /users/progress       # Get progress data
POST   /users/mood-check     # Log daily mood
```

#### Chat (Sham AI)

```http
GET    /chat/conversations          # Get all conversations
GET    /chat/conversation/:id/messages  # Get messages
POST   /chat/send                   # Send message to Sham
GET    /chat/suggested-responses    # Get quick replies
```

### Response Format

All responses follow this structure:

```json
{
  "status": "success" | "error",
  "message": "Optional message",
  "data": { ... },
  "errors": [ ... ]  // Only for errors
}
```

---

## 🗄️ Database Schema

The database consists of 15+ tables organized into logical groups:

### User Management
- `users` - User accounts
- `user_profiles` - Extended user information
- `progress` - Daily progress tracking

### Learning
- `modules` - Educational content
- `user_modules` - User progress in modules

### Sham AI
- `chat_messages` - Conversation history
- `sham_memory` - Long-term memory for personalization

### Jobs
- `jobs` - Available opportunities
- `job_applications` - User applications

### Community
- `community_groups` - Support groups
- `group_members` - Group memberships
- `group_messages` - Group conversations

### Gamification
- `achievements` - Available achievements
- `user_achievements` - Unlocked achievements

For full schema details, see `backend/prisma/schema.prisma`

---

## 🔒 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email: **security@srp-platform.org**

**Do not** open public issues for security concerns.

### Security Practices

- All passwords are hashed using bcrypt (12 rounds)
- JWT tokens expire after 15 minutes (refresh tokens after 7 days)
- Rate limiting on all API endpoints
- Input validation using Zod
- Parameterized queries prevent SQL injection
- Sensitive data sanitized in logs
- HTTPS enforced in production

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💖 Acknowledgments

- **Syrian people** for their resilience and strength
- **Anthropic** for providing Claude API
- **Open source community** for amazing tools and libraries
- **Mental health professionals** who guided trauma-informed design

---

## 🌸 Mission Statement

*"Every Syrian deserves a path from trauma to hope, from survival to thriving. This platform is our contribution to the renaissance of a resilient people."*

---

**Built with ❤️ for the Syrian community**
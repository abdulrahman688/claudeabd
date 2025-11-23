# 🚀 SHAM Backend - Microservices Architecture

منصة شام للتمويل الجماعي - Backend متكامل بنظام Microservices

## 📁 هيكل المشروع

```
backend/
├── services/
│   ├── user-service/          # خدمة المستخدمين والمصادقة (NestJS)
│   ├── project-service/       # خدمة المشاريع (NestJS)
│   ├── investment-service/    # خدمة الاستثمارات (NestJS)
│   ├── payment-service/       # خدمة الدفع (NestJS)
│   ├── ai-service/           # خدمة الذكاء الاصطناعي (Python/FastAPI)
│   └── blockchain-service/   # خدمة البلوك تشين (Go)
├── docker-compose.yml        # تكوين Docker Compose
├── kong.yml                  # تكوين API Gateway
└── README.md
```

## 🛠️ التقنيات المستخدمة

### Core Services (NestJS)
- **Node.js** + **TypeScript**
- **NestJS** - Framework
- **TypeORM** - ORM للتعامل مع PostgreSQL
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Redis** - Cache & Sessions
- **JWT** - Authentication
- **Passport** - Auth Strategies

### AI Service (Python)
- **FastAPI** - Web Framework
- **Anthropic Claude** - AI Chatbot
- **Scikit-learn** - Machine Learning
- **TensorFlow** - Deep Learning
- **WebSockets** - Real-time Communication

### Blockchain Service (Go)
- **Gin** - Web Framework
- **go-ethereum** - Ethereum Client
- **Solidity** - Smart Contracts

### Infrastructure
- **Docker** - Containerization
- **Kong** - API Gateway
- **Prometheus** - Monitoring
- **Grafana** - Visualization
- **MongoDB** - Logs & Analytics

## 🚀 البدء السريع

### المتطلبات الأساسية

```bash
- Docker & Docker Compose
- Node.js >= 20
- Python >= 3.11
- Go >= 1.21
```

### 1. تثبيت وتشغيل كل الخدمات

```bash
# Clone the repository
git clone https://github.com/your-repo/sham-backend.git
cd sham-backend

# Copy environment variables
cp .env.example .env

# تعديل الـ .env وإضافة API Keys
nano .env

# تشغيل كل الخدمات
docker-compose up -d

# متابعة Logs
docker-compose logs -f
```

### 2. تشغيل خدمة واحدة فقط

```bash
# User Service فقط
cd services/user-service
npm install
npm run start:dev

# AI Service فقط
cd services/ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📡 API Endpoints

### User Service (Port 3001)

#### Authentication
```bash
# Register
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "investor",
  "type": "diaspora",
  "country": "Germany"
}

# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}

# Verify Email
GET /api/v1/auth/verify-email?token=TOKEN

# Enable 2FA
POST /api/v1/auth/2fa/enable
Authorization: Bearer TOKEN

# Verify 2FA
POST /api/v1/auth/2fa/verify
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "token": "123456"
}
```

#### Users
```bash
# Get Current User
GET /api/v1/users/me
Authorization: Bearer TOKEN

# Update Profile
PUT /api/v1/users/me
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "firstName": "أحمد",
  "lastName": "محمد",
  "bio": "..."
}

# Get My Investments
GET /api/v1/users/me/investments
Authorization: Bearer TOKEN

# Toggle Mentor Availability
PUT /api/v1/users/me/toggle-mentor
Authorization: Bearer TOKEN
```

#### Wallet
```bash
# Get Balance
GET /api/v1/wallet/balance
Authorization: Bearer TOKEN
```

### AI Service (Port 8000)

#### Sham Chatbot
```bash
# Chat Message
POST /api/v1/ai/chat/message
Content-Type: application/json

{
  "message": "كيف أبدأ مشروعي؟",
  "user_id": "user-uuid",
  "user_context": {
    "role": "entrepreneur",
    "type": "local",
    "projects_count": 0
  }
}

# WebSocket (Real-time)
WS /api/v1/ai/chat/stream

# Get Conversation History
GET /api/v1/ai/chat/conversation-history/{user_id}
```

#### Risk Assessment
```bash
# Assess Project Risk
POST /api/v1/ai/risk/assess-project
Content-Type: application/json

{
  "project_id": "project-uuid",
  "category": "BAKERY",
  "location": "Damascus",
  "funding_goal": 50000,
  "owner_experience": 3,
  "timeline_months": 12,
  "description": "..."
}

# Assess Portfolio Risk
POST /api/v1/ai/risk/assess-portfolio?user_id=USER_ID

# Market Analysis
GET /api/v1/ai/risk/market-analysis?category=BAKERY
```

#### Fraud Detection
```bash
# Analyze Project Authenticity
POST /api/v1/ai/fraud/analyze-project
Content-Type: application/json

{
  "project_id": "project-uuid",
  "description": "...",
  "images": ["ipfs_hash_1", "ipfs_hash_2"],
  "documents": ["ipfs_hash_3"],
  "expected_roi": 25
}

# Verify Milestone Proof
POST /api/v1/ai/fraud/verify-milestone
Content-Type: application/json

{
  "milestone_id": "milestone-uuid",
  "proof_description": "...",
  "images": ["ipfs_hash_1"]
}
```

#### NLP Engine
```bash
# Sentiment Analysis
POST /api/v1/ai/nlp/sentiment
Content-Type: application/json

{
  "text": "أنا سعيد جداً بهذا المشروع"
}

# Extract Entities
POST /api/v1/ai/nlp/extract-entities
Content-Type: application/json

{
  "text": "..."
}

# Translate
POST /api/v1/ai/nlp/translate?text=Hello&target_lang=ar
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'investor',
  type VARCHAR(20) NOT NULL,
  country VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  is_mentor_available BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  skills TEXT[],
  languages TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address VARCHAR(42) UNIQUE NOT NULL,
  balance DECIMAL(18, 8) DEFAULT 0,
  total_invested DECIMAL(18, 2) DEFAULT 0,
  total_returns DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 الأمان

### Authentication Flow
1. User registers → Email verification sent
2. User verifies email → Account activated
3. User enables 2FA (optional) → QR Code generated
4. User logs in → JWT token issued
5. JWT token used for API calls

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration
- ✅ 2FA with TOTP (speakeasy)
- ✅ Rate limiting (Kong)
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 📊 Monitoring

### Prometheus Metrics
```
http://localhost:9090
```

### Grafana Dashboards
```
http://localhost:3000
Username: admin
Password: admin
```

## 🧪 Testing

```bash
# User Service Tests
cd services/user-service
npm run test
npm run test:cov

# AI Service Tests
cd services/ai-service
pytest
pytest --cov
```

## 📝 Environment Variables

راجع ملف `.env.example` للمتغيرات المطلوبة:

```bash
# Required
JWT_SECRET=             # JWT Secret Key
ANTHROPIC_API_KEY=      # Claude API Key

# Optional
OPENAI_API_KEY=         # OpenAI API Key
STRIPE_SECRET_KEY=      # Stripe for payments
POLYGON_RPC_URL=        # Polygon RPC
```

## 🐛 Troubleshooting

### خدمة لا تعمل
```bash
# Check service logs
docker-compose logs service-name

# Restart service
docker-compose restart service-name

# Rebuild service
docker-compose up -d --build service-name
```

### قاعدة البيانات فارغة
```bash
# Run migrations
docker-compose exec user-service npm run typeorm migration:run
```

### Connection Refused
```bash
# Check if services are running
docker-compose ps

# Check networks
docker network ls
docker network inspect sham_network
```

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- GitHub Issues: https://github.com/your-repo/issues
- Email: support@sham.sy

## 📄 الترخيص

MIT License - راجع ملف LICENSE للتفاصيل

---

Made with ❤️ for Syrian Entrepreneurs

# 🎨 SHAM Frontend - React + TypeScript

Frontend application for SHAM crowdfunding platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── features/           # Feature modules
│   ├── auth/          # Authentication
│   ├── projects/      # Projects
│   └── investments/   # Investments
├── shared/            # Shared components
│   ├── components/    # UI components
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utilities
├── core/              # Core setup
│   ├── api/          # API client
│   ├── store/        # Redux store
│   └── routes/       # Routing
└── pages/            # Page components
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Query** - Server state
- **React Router** - Routing
- **React Hook Form** - Forms
- **Zod** - Validation

## 🔗 API Integration

The frontend connects to backend services:
- User Service: Port 3001
- Project Service: Port 3002
- Investment Service: Port 3003
- AI Service: Port 8000

## 📝 Environment Variables

Copy `.env.example` to `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## ✅ Features

- ✅ Authentication (Login/Register)
- ✅ Project browsing
- ✅ Investment management
- ✅ Portfolio dashboard
- ✅ Responsive design
- ✅ Arabic RTL support

## 📞 Support

For issues: https://github.com/your-repo/issues

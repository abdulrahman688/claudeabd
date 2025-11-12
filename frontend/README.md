# 🌸 Syrian Renaissance Platform - Frontend

Professional, trauma-informed frontend for the Syrian Renaissance Platform.

---

## 📁 Structure

```
frontend/
├── public/                    # HTML pages
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── register.html         # Registration (3-step)
│   ├── dashboard.html        # User dashboard (future)
│   └── book.html             # Book showcase (future)
│
├── assets/
│   ├── css/
│   │   └── main.css          # Custom styles
│   ├── js/
│   │   ├── main.js           # Main utilities
│   │   └── api.js            # API client
│   ├── images/               # Images
│   └── fonts/                # Custom fonts
│
└── components/               # Reusable components
```

---

## ✨ Features

### Implemented

✅ **Home Page** - Beautiful landing with hero section, features, testimonials
✅ **Authentication** - Login and 3-step registration with validation
✅ **API Integration** - Complete API client with token management
✅ **Responsive Design** - Mobile-first, works on all devices
✅ **Arabic RTL** - Full RTL support with Cairo font
✅ **Animations** - Smooth transitions and fade-in effects
✅ **Form Validation** - Client-side validation for all forms
✅ **Toast Notifications** - User-friendly alerts
✅ **Loading States** - Spinners for async operations

### Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling via CDN
- **Vanilla JavaScript** - No framework dependencies
- **Cairo Font** - Beautiful Arabic typography
- **Font Awesome** - Icons

---

## 🚀 Getting Started

### Option 1: Serve with Python

```bash
cd frontend/public
python3 -m http.server 8080
```

Open: http://localhost:8080

### Option 2: Serve with Node.js

```bash
npm install -g http-server
cd frontend/public
http-server -p 8080
```

### Option 3: Use Live Server (VS Code)

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🎨 Design System

### Colors

- **Primary**: `#2E7D32` (Green Hope)
- **Secondary**: `#D4A574` (Damascus Gold)
- **Accent**: `#1976D2` (Syrian Sky Blue)

### Typography

- **Font Family**: Cairo (Arabic), Roboto (English)
- **Weights**: 300 (Light), 400 (Regular), 600 (SemiBold), 700 (Bold), 900 (Black)

### Components

All components follow trauma-informed design principles:
- Warm, inviting colors
- Soft shadows and rounded corners
- Clear, reassuring copy
- Smooth animations (never jarring)

---

## 📡 API Integration

The frontend communicates with the backend API at `http://localhost:3000/api/v1`.

### API Client (`api.js`)

```javascript
// Usage example
const api = new APIClient('http://localhost:3000/api/v1');

// Register
await api.register({ username, password, country });

// Login
await api.login({ username, password });

// Get profile
await api.getProfile();

// Send message to Sham
await api.sendMessage('مرحباً شام!');
```

### Token Management

- Access tokens stored in `localStorage`
- Automatic token refresh on 401 responses
- Tokens cleared on logout

---

## 🔒 Security

- All passwords validated (min 8 characters)
- HTTPS enforced in production
- XSS protection via input sanitization
- CSRF tokens (future implementation)
- Content Security Policy headers

---

## 📱 Pages

### 1. Home Page (`index.html`)

- Hero section with CTA
- Features (Healing, Learning, Earning)
- Book showcase
- Testimonials
- Footer

### 2. Login Page (`login.html`)

- Username/password form
- Remember me checkbox
- Password visibility toggle
- Forgot password link
- API integration with error handling

### 3. Register Page (`register.html`)

**3-Step Registration:**

**Step 1:** Basic Info
- Username (min 3 chars)
- Password (min 8 chars)
- Password confirmation

**Step 2:** Location
- Country selection
- City (optional)
- Displaced checkbox

**Step 3:** Goals
- Healing checkbox
- Learning checkbox
- Earning checkbox
- Terms acceptance

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh on 401
- [ ] Logout

**Forms:**
- [ ] Validation works
- [ ] Error messages display
- [ ] Success messages display
- [ ] Loading states work

**Responsive:**
- [ ] Mobile (< 768px)
- [ ] Tablet (768-1024px)
- [ ] Desktop (> 1024px)

---

## 🎯 Future Enhancements

### Dashboard
- User journey visualization
- Progress tracking
- Streak calendar
- Achievements display

### Sham Chat
- Real-time messaging
- Voice messages
- Quick responses
- Mood tracker integration

### Modules
- Video player
- Quiz system
- Progress saving
- Certificate generation

### Jobs
- Job listing
- Application form
- Payment integration
- Rating system

### Community
- Group chat
- Forum posts
- Success stories
- Events calendar

---

## 📝 Code Style

- **Indentation**: 2 spaces
- **Naming**: camelCase for JS, kebab-case for CSS
- **Comments**: Descriptive, in Arabic for user-facing text
- **Functions**: Single responsibility principle
- **Variables**: Descriptive names

---

## 🐛 Known Issues

None currently. Report issues to: support@srp-platform.org

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Email**: support@srp-platform.org
- **GitHub**: Report issues on repo

---

## 🌸 Built with Love

Every pixel, every animation, every word was designed with compassion for Syrian trauma survivors.

This is not just a website - it's a gateway to healing, learning, and thriving.

**May every user find hope here. 🌸**

---

© 2025 Syrian Renaissance Platform. All rights reserved.

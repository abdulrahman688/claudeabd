# 👑 ZENOBIA'S LEGACY - Website

> *"From Palmyra's Heritage, By Syria's Hands"*

## 📋 Project Overview

Zenobia's Legacy is an e-commerce website for a social enterprise that empowers Syrian widows through traditional Aleppo soap-making. Named after the legendary Queen Zenobia of Palmyra, this platform celebrates strength, heritage, and dignity.

### Mission
- Empower Syrian widows through meaningful employment
- Preserve UNESCO-recognized 1,000-year soap-making tradition
- Create ethical commerce that values people over profit
- Connect conscious consumers with authentic Syrian craftsmanship

---

## 🚀 Features

### Phase 1 (Current Implementation)

#### Core Pages
- ✅ **Homepage** - Hero section, storytelling, impact stats, testimonials
- ✅ **Shop** - Product catalog with filtering and sorting
- ✅ **Impact** - Women's stories and financial transparency
- ✅ **Our Story** - Queen Zenobia history and soap-making process
- ✅ **About** - Mission, values, and how we work
- ✅ **Contact** - Contact form, FAQ accordion, contact information
- ✅ **Cart** - Full shopping cart page with checkout flow

#### Functionality
- ✅ Fully functional shopping cart with LocalStorage persistence
- ✅ Product filtering by collection and price
- ✅ Product sorting (price, name, featured)
- ✅ Animated statistics counters
- ✅ Testimonials carousel
- ✅ Newsletter signup form
- ✅ Contact form with validation
- ✅ FAQ accordion
- ✅ Mobile-responsive navigation
- ✅ Smooth scroll animations
- ✅ Image lazy loading

---

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Animations
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Font Awesome 6.4.0** - Icons
- **Google Fonts** - Cinzel & Open Sans

---

## 📁 Project Structure

```
zenobia-legacy/
├── index.html              # Homepage
├── shop.html               # Shop page
├── impact.html             # Impact stories
├── story.html              # Our story
├── about.html              # About us
├── contact.html            # Contact form
├── cart.html               # Shopping cart
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # General functionality
│   └── cart.js             # Shopping cart
├── images/                 # Image assets (add your images here)
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
└── README.md               # This file
```

---

## 🎨 Brand Guidelines

### Colors
- **Royal Gold:** #D4AF37 (luxury, prestige)
- **Deep Black:** #000000 (elegance)
- **Warm Cream:** #F5F5DC (natural, pure)
- **Olive Green:** #6B8E23 (nature, Syria)

### Typography
- **Headings:** Cinzel (serif) - Elegant, regal
- **Body:** Open Sans (sans-serif) - Clean, readable

---

## 🛍️ Shopping Cart

The shopping cart is fully functional with:
- LocalStorage persistence
- Real-time updates
- Sidebar cart view
- Full cart page
- Add/remove/update quantities

### Products
6 products pre-loaded:
1. Royal Aleppo (€3.50)
2. Damascus Rose (€3.80)
3. Pure Olive (€3.20)
4. Lavender Dream (€3.80)
5. Black Seed (€4.20)
6. Jasmine Night (€3.80)

---

## 📱 Responsive Design

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

Mobile features:
- Hamburger menu
- Touch-friendly buttons
- Optimized layouts

---

## 🔧 Setup & Installation

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd claudeabd
```

2. **Add images**
Place product images in `images/products/`:
- royal-aleppo.jpg
- damascus-rose.jpg
- olive-pure.jpg
- lavender.jpg
- black-seed.jpg
- jasmine.jpg

Add content images:
- `images/hero-bg.jpg`
- `images/soap-stack.jpg`
- `images/palmyra.jpg`
- `images/soap-making.jpg`

3. **Open in browser**
Simply open `index.html` in your browser!

### Local Server (Optional)

**Python:**
```bash
python -m http.server 8000
```

**Node:**
```bash
npx serve
```

---

## 🚀 Deployment

### Recommended Hosting
- **Netlify** (recommended) - Free, automatic
- **Vercel** - Fast, global CDN
- **GitHub Pages** - Free for public repos

### Netlify Deployment
1. Sign up at netlify.com
2. Connect GitHub repository
3. Deploy with default settings
4. Your site is live!

---

## 📊 Adding Analytics

Add before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🛒 E-commerce Integration

### Payment Gateways
- **Stripe** (recommended)
- **PayPal**

Contact form currently demos only. For production:
1. Set up backend server
2. Integrate payment gateway
3. Add email service
4. Configure webhooks

---

## ♿ Accessibility

- ✅ WCAG AA color contrast
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Alt text on images
- ✅ Semantic HTML

---

## 📈 Success Metrics

### E-commerce Goals
- Conversion rate: 3%+ target
- Average order: €15+
- Cart abandonment: <50%

### Social Impact
- 10 women employed ✅
- €85 avg income ✅
- 40 children supported ✅
- 450 soaps/month ✅

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] Add real product images
- [ ] Set up payment gateway
- [ ] Configure email service
- [ ] Add analytics
- [ ] Test all forms
- [ ] Mobile testing
- [ ] Browser testing
- [ ] SEO audit

### Launch
- [ ] Deploy to hosting
- [ ] Configure domain
- [ ] Enable SSL
- [ ] Submit sitemap
- [ ] Social media announcement

---

## 💡 Maintenance

### Regular Tasks
- Update products weekly
- Add impact stories monthly
- Update stats monthly
- Check analytics monthly

### Adding New Products
Edit `js/main.js` and add to PRODUCTS:
```javascript
7: {
    id: 7,
    name: 'Product Name',
    category: 'Collection',
    price: 3.50,
    image: 'images/products/image.jpg',
    description: 'Description'
}
```

---

## 📞 Support

For questions about the website:
- Email: info@zenobiaslegacy.com
- Location: Damascus, Syria

---

## 📄 License

Copyright © 2025 Zenobia's Legacy. All rights reserved.

---

**Built with ❤️ for Syrian women empowerment**

👑 **ZENOBIA'S LEGACY** 🇸🇾

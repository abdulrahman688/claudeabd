# 🌐 ZENOBIA'S LEGACY - Website Development Brief
## Complete Project Specification for Developer

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Brand Identity](#brand-identity)
3. [Website Structure](#website-structure)
4. [Features & Functionality](#features-functionality)
5. [Design Guidelines](#design-guidelines)
6. [Content Requirements](#content-requirements)
7. [Technical Requirements](#technical-requirements)
8. [User Experience](#user-experience)
9. [Reference Websites](#reference-websites)
10. [Deliverables](#deliverables)
11. [Timeline & Budget](#timeline-budget)

---

## 1. PROJECT OVERVIEW

### **Project Name:**
Zenobia's Legacy

### **Project Type:**
E-commerce website for handmade Aleppo soap social enterprise

### **Mission:**
Empower Syrian widows through traditional soap-making while preserving UNESCO-recognized heritage.

### **Target Audience:**
- **Primary:** Conscious consumers (25-45, values ethics & quality)
- **Secondary:** Syrian diaspora (nostalgic connection)
- **Tertiary:** Gift buyers (meaningful presents)

### **Business Model:**
Direct-to-consumer + Wholesale B2B

### **Unique Selling Points:**
1. ✅ Social impact (empowering widows)
2. ✅ UNESCO heritage (1,000+ year tradition)
3. ✅ Premium quality at accessible price
4. ✅ Transparent impact reporting
5. ✅ Named after legendary Syrian Queen

---

## 2. BRAND IDENTITY

### **Brand Story:**
Named after Queen Zenobia (240-274 CE), who ruled one of the most powerful empires from Palmyra. Today, 10 Syrian widows in Damascus continue her legacy of strength and independence through traditional Aleppo soap-making.

### **Brand Personality:**
- Regal yet approachable
- Historic yet modern
- Premium yet accessible
- Empowering not pitying

### **Brand Voice:**
- Tone: Elegant, authentic, warm
- Language: Professional but personal
- Style: Storytelling-focused
- Avoid: Charity language, pity, over-sentimentality

### **Color Palette:**

```
PRIMARY COLORS:
- Royal Gold: #D4AF37 (luxury, heritage, prestige)
- Deep Black: #000000 (elegance, sophistication)
- Warm Cream: #F5F5DC (purity, natural, soap)

ACCENT COLORS:
- Olive Green: #6B8E23 (nature, olive oil, Syria)
- Stone Beige: #D2B48C (earth, tradition)

USAGE:
- Gold: Headers, CTAs, highlights, icons
- Black: Text, navbar, footer, dividers
- Cream: Backgrounds, sections, cards
- Olive: Accents, hover states, badges
- Stone: Subtle backgrounds, borders
```

### **Typography:**

```
HEADINGS:
Font: 'Cinzel' (serif)
Weight: 400, 600, 700
Style: Elegant, regal, timeless
Usage: H1, H2, H3, Logo

BODY TEXT:
Font: 'Open Sans' (sans-serif)
Weight: 300, 400, 600
Style: Clean, readable, modern
Usage: Paragraphs, descriptions, UI

HIERARCHY:
H1: 48-64px (Hero titles)
H2: 36-48px (Section titles)
H3: 24-32px (Subsections)
H4: 20-24px (Card titles)
Body: 16-18px (Main text)
Small: 14px (Captions, meta)
```

### **Logo:**
- Crown symbol + wordmark "ZENOBIA'S LEGACY"
- Gold on black OR black on cream
- Should be provided in: PNG, SVG, EPS
- Variations: Full logo, icon only, horizontal, vertical

### **Visual Style:**
- Photography: Natural light, warm tones, authentic moments
- Layout: Clean, spacious, sophisticated
- Elements: Minimal ornamentation, gold accents
- Mood: Elegant luxury meets authentic craftsmanship

---

## 3. WEBSITE STRUCTURE

### **Site Map:**

```
HOME (/)
├── Hero Section
├── Story Section (Queen Zenobia + Women)
├── Heritage Section (UNESCO, tradition)
├── Products Preview
├── Impact Stats
├── Testimonials
└── CTA

SHOP (/shop)
├── Product Grid (6 products)
├── Filters Sidebar
├── Shopping Cart
└── Product Quick View

IMPACT (/impact)
├── Monthly Stats
├── Women's Stories
├── Financial Transparency
└── Timeline

OUR STORY (/story)
├── Queen Zenobia History
├── The Women
├── The Process
└── Our Vision

ABOUT (/about)
├── Founder Story
├── Mission & Values
├── Partners
└── Press

CONTACT (/contact)
├── Contact Form
├── Email/Phone
├── Location (Damascus)
└── FAQ

BLOG (/blog) [Phase 2]
├── Women's Stories
├── Soap Making Process
├── Syrian Culture
└── Impact Updates

CART (/cart)
└── Shopping Cart Page

CHECKOUT (/checkout)
└── Payment & Shipping
```

---

## 4. FEATURES & FUNCTIONALITY

### **MUST-HAVE Features (Phase 1):**

#### **4.1 Navigation:**
- ✅ Fixed navbar on scroll
- ✅ Mobile hamburger menu
- ✅ Cart icon with item count
- ✅ Smooth scroll to sections
- ✅ Active page indicator

#### **4.2 Homepage:**
- ✅ Hero section with animations
- ✅ Storytelling sections
- ✅ Animated statistics counters
- ✅ Testimonials carousel
- ✅ Newsletter signup
- ✅ Call-to-action buttons

#### **4.3 Shop Page:**
- ✅ Product grid layout
- ✅ Filter by category
- ✅ Sort by price/name/date
- ✅ Product cards with hover effects
- ✅ Quick view modal
- ✅ Add to cart functionality
- ✅ Product badges (Bestseller, New, etc.)

#### **4.4 Shopping Cart:**
- ✅ Sidebar cart (slides from right)
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Calculate subtotal
- ✅ Save cart in LocalStorage
- ✅ Cart persists on refresh
- ✅ Empty cart state

#### **4.5 Product Pages:**
- ✅ Large product images
- ✅ Image zoom on hover
- ✅ Product details (weight, ingredients)
- ✅ Add to cart button
- ✅ Related products
- ✅ Share buttons

#### **4.6 Impact Page:**
- ✅ Monthly statistics
- ✅ Women's transformation stories
- ✅ Before/After comparisons
- ✅ Financial breakdown charts
- ✅ Timeline visualization

#### **4.7 Forms:**
- ✅ Contact form with validation
- ✅ Newsletter signup
- ✅ Form error states
- ✅ Success messages

#### **4.8 Responsive Design:**
- ✅ Mobile-first approach
- ✅ Breakpoints: 320px, 768px, 1024px, 1440px
- ✅ Touch-friendly buttons
- ✅ Optimized images

#### **4.9 Performance:**
- ✅ Lazy loading images
- ✅ Optimized assets
- ✅ Fast page load (<3 seconds)
- ✅ Smooth animations (60fps)

#### **4.10 SEO:**
- ✅ Semantic HTML5
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Schema markup
- ✅ Sitemap
- ✅ robots.txt

---

### **NICE-TO-HAVE Features (Phase 2):**

- 🔄 Multi-language (EN/AR)
- 🔄 Product reviews/ratings
- 🔄 Wishlist functionality
- 🔄 User accounts
- 🔄 Order tracking
- 🔄 Live chat
- 🔄 Advanced filtering
- 🔄 Blog section
- 🔄 Gift registry
- 🔄 Subscription boxes

---

## 5. DESIGN GUIDELINES

### **5.1 Layout Principles:**

```css
Container Width: max-width: 1200px
Padding: 2rem (mobile: 1rem)
Grid Gap: 2rem
Section Spacing: 5rem vertical (mobile: 3rem)
```

### **5.2 Spacing System:**

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 2rem (32px)
xl: 3rem (48px)
xxl: 5rem (80px)
```

### **5.3 Button Styles:**

```css
PRIMARY BUTTON:
- Background: Gold (#D4AF37)
- Text: Black
- Padding: 1rem 2rem
- Border: 2px solid gold
- Hover: Transparent bg, gold text
- Transition: 0.3s ease

SECONDARY BUTTON:
- Background: Transparent
- Text: Black
- Border: 2px solid black
- Hover: Black bg, gold text
```

### **5.4 Card Styles:**

```css
PRODUCT CARD:
- Background: White
- Shadow: 0 4px 20px rgba(0,0,0,0.1)
- Hover: translateY(-10px), deeper shadow
- Transition: 0.3s ease
- Border-radius: 0 (sharp corners for elegance)

STORY CARD:
- Background: Cream
- Border-left: 4px solid gold
- Padding: 2rem
- Hover: Slight scale
```

### **5.5 Animation Guidelines:**

```css
FADE IN:
- Opacity: 0 → 1
- Transform: translateY(20px) → 0
- Duration: 0.6s
- Easing: ease-out

SLIDE IN:
- Transform: translateX(-100%) → 0
- Duration: 0.4s
- Easing: ease-in-out

HOVER EFFECTS:
- Scale: 1 → 1.05
- Duration: 0.3s
- Easing: ease
```

### **5.6 Image Guidelines:**

```
PRODUCT IMAGES:
- Aspect Ratio: 1:1 (square)
- Min Resolution: 800x800px
- Format: WebP (fallback: JPG)
- Alt text: Required

HERO IMAGES:
- Aspect Ratio: 16:9
- Resolution: 1920x1080px
- Format: WebP
- Overlay: Dark gradient

PORTRAITS:
- Aspect Ratio: 3:4
- Resolution: 600x800px
- Style: Natural, warm tones
```

---

## 6. CONTENT REQUIREMENTS

### **6.1 Homepage Content:**

**Hero Section:**
```
Headline: "ZENOBIA'S LEGACY"
Subheadline: "From Palmyra's Heritage, By Syria's Hands"
Description: "Handmade Aleppo soap by Syrian widows.
Ancient tradition • Modern empowerment"
CTA Buttons: "Shop Now" | "Our Story"
```

**Story Cards:**
```
Card 1: Queen Zenobia
- Icon: Crown
- Title: "Queen Zenobia"
- Text: "In 270 CE, Queen Zenobia ruled one of
the most powerful empires in the ancient world..."

Card 2: Her Spirit Lives On
- Icon: Hands Helping
- Title: "Her Spirit Lives On"
- Text: "Today, 10 Syrian widows in Damascus..."

Card 3: Your Impact
- Icon: Heart
- Title: "Your Impact"
- Text: "Every bar you buy supports a woman..."
```

**Impact Stats:**
```
Stat 1: 10 Women Employed
Stat 2: 450 Soaps Made Monthly
Stat 3: 40 Children Fed Daily
Stat 4: €85 Average Monthly Income
```

### **6.2 Product Content:**

**Product Template:**
```
NAME: Royal Aleppo
CATEGORY: Classic Collection
DESCRIPTION: Our signature soap. 88% olive oil,
12% laurel oil. The timeless recipe that has been
made for over 1,000 years.
PRICE: €3.50
WEIGHT: 200g
USAGE: 2-3 months daily use
INGREDIENTS: Olive oil, Laurel oil, Water,
Sodium hydroxide
BENEFITS:
- Naturally antibacterial
- Gentle for all skin types
- Moisturizing
- Biodegradable
```

### **6.3 Women's Stories:**

**Story Template:**
```
NAME: Fatima
AGE: 42
FAMILY: Mother of 4
BEFORE: "Before Zenobia's Legacy, I struggled
to feed my children..."
AFTER: "Now I earn €85/month making soap.
My oldest daughter is back in school."
QUOTE: "I'm not just making soap. I'm building
a future."
STATS:
- Monthly Income: €85
- Children Supported: 4
```

---

## 7. TECHNICAL REQUIREMENTS

### **7.1 Tech Stack:**

**Frontend:**
```
HTML5: Semantic markup
CSS3: Grid, Flexbox, Animations
JavaScript: ES6+, Vanilla JS (no frameworks)
```

**Libraries & Dependencies:**
```
Font Awesome: v6.4.0 (icons)
Google Fonts: Cinzel + Open Sans
No jQuery (use vanilla JS)
```

**Build Tools (Optional):**
```
Task Runner: npm scripts
CSS: PostCSS/Autoprefixer
JS: Babel (ES6 transpiling)
Images: Image optimization
```

### **7.2 Browser Support:**

```
Chrome: Latest 2 versions ✅
Firefox: Latest 2 versions ✅
Safari: Latest 2 versions ✅
Edge: Latest 2 versions ✅
IE11: No support ❌
Mobile Safari: iOS 12+ ✅
Chrome Mobile: Latest ✅
```

### **7.3 Performance Targets:**

```
First Contentful Paint: <1.5s
Speed Index: <3.0s
Time to Interactive: <3.5s
Lighthouse Score: 90+
Mobile Score: 85+
```

### **7.4 Accessibility:**

```
WCAG Level: AA compliance
Keyboard Navigation: Full support
Screen Readers: ARIA labels
Color Contrast: 4.5:1 minimum
Alt Text: All images
Focus Indicators: Visible
```

### **7.5 SEO Requirements:**

```html
<!-- Meta Tags -->
<title>Zenobia's Legacy | Handmade Aleppo Soap</title>
<meta name="description" content="...">
<meta name="keywords" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">

<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Zenobia's Legacy",
  ...
}
</script>
```

### **7.6 Hosting & Deployment:**

```
Hosting: Netlify or Vercel (recommended)
Domain: TBD (will provide)
SSL: Required (HTTPS)
CDN: Automatic (via hosting)
Git: GitHub repository
```

---

## 8. USER EXPERIENCE

### **8.1 User Flows:**

**Flow 1: First-Time Visitor → Purchase**
```
1. Land on homepage
2. Read hero section (5 seconds)
3. Scroll to story section (10 seconds)
4. Click "Shop Now" CTA
5. Browse products (30 seconds)
6. Click product (view details)
7. Click "Add to Cart"
8. View cart sidebar
9. Click "Checkout"
10. Complete purchase

TOTAL TIME: 2-3 minutes
FRICTION POINTS: None should exist
```

**Flow 2: Returning Customer → Quick Purchase**
```
1. Land on any page
2. Click cart icon (if remembered item)
   OR navigate to Shop
3. Add to cart
4. Checkout (auto-fill saved info)
5. Complete purchase

TOTAL TIME: 30-60 seconds
```

**Flow 3: Curious Visitor → Learns About Impact**
```
1. Land on homepage
2. Scroll to impact stats
3. Click "See Full Impact Report"
4. Read women's stories
5. View transparency data
6. Feel inspired → Shop

TOTAL TIME: 3-5 minutes
```

### **8.2 Interaction Design:**

**Buttons:**
- Hover: Scale slightly, change colors
- Click: Brief press animation
- Loading: Spinner or progress indicator

**Forms:**
- Focus: Highlight active field
- Error: Red border + error message
- Success: Green checkmark + confirmation

**Cards:**
- Hover: Lift effect (translateY)
- Click: Navigate to detail page
- Loading: Skeleton screens

**Cart:**
- Open: Slide from right
- Close: Click overlay or X button
- Update: Smooth number transitions

**Images:**
- Loading: Blur-up placeholder
- Hover: Zoom slightly
- Click: Open lightbox (product images)

---

## 9. REFERENCE WEBSITES

### **Design Inspiration:**

**1. Dr. Bronner's (Ethical Soap)**
- URL: https://www.drbronner.com/
- Learn from: Product presentation, storytelling
- Avoid: Too busy, overwhelming info

**2. Patagonia (Social Enterprise)**
- URL: https://www.patagonia.com/
- Learn from: Impact storytelling, authenticity
- Avoid: Too minimal, less luxury feel

**3. Aesop (Luxury Natural Products)**
- URL: https://www.aesop.com/
- Learn from: Elegant design, sophistication
- Avoid: Too cold, not warm enough

**4. Ten Thousand Villages (Fair Trade)**
- URL: https://www.tenthousandvillages.com/
- Learn from: Artisan stories, social impact
- Avoid: Outdated design, not premium enough

**5. Glossier (Modern E-commerce)**
- URL: https://www.glossier.com/
- Learn from: Clean UI, smooth shopping experience
- Avoid: Too minimal, not enough heritage feel

### **What We Want:**
```
Aesop's elegance
+ Patagonia's authenticity
+ Dr. Bronner's story
+ Glossier's UX
+ Syrian heritage/warmth
= ZENOBIA'S LEGACY
```

---

## 10. DELIVERABLES

### **Phase 1 Deliverables:**

**Design:**
- [ ] Wireframes (low-fidelity)
- [ ] Mockups (high-fidelity, 3 pages)
- [ ] Style guide document
- [ ] Logo adaptations

**Development:**
- [ ] Responsive HTML/CSS/JS
- [ ] 6 pages (Home, Shop, Impact, Story, About, Contact)
- [ ] Shopping cart functionality
- [ ] Contact forms
- [ ] SEO optimization
- [ ] Cross-browser testing

**Assets:**
- [ ] Optimized images
- [ ] Icon set
- [ ] Social media graphics (optional)

**Documentation:**
- [ ] Code documentation
- [ ] CMS guide (if applicable)
- [ ] Deployment guide

**Handoff:**
- [ ] Source files
- [ ] Git repository access
- [ ] Hosting setup
- [ ] Training session (1 hour)

---

## 11. TIMELINE & BUDGET

### **Proposed Timeline:**

```
Week 1: Discovery & Design
- Kickoff meeting
- Wireframes
- Design mockups
- Client review & feedback

Week 2-3: Development
- Homepage development
- Shop page development
- Impact page development
- Other pages
- Functionality implementation

Week 4: Polish & Testing
- Cross-browser testing
- Mobile optimization
- Performance optimization
- Bug fixes
- Client review

Week 5: Launch
- Final revisions
- Deployment
- Training
- Go live!

TOTAL: 5 weeks
```

### **Budget:**
```
EXPECTED RANGE: €1,500 - €3,000

BREAKDOWN (estimate):
Design: €500-800
Development: €800-1,500
Testing & QA: €200-400
Deployment: €100-200
Training: €100

PAYMENT TERMS:
- 30% upfront
- 40% at development milestone
- 30% upon completion
```

---

## 12. ADDITIONAL NOTES

### **Content Readiness:**
- Product images: Will be provided
- Women's photos: Will be provided (with permission)
- All text content: Will be provided
- Logo: Will be provided

### **Future Phases:**
- Phase 2: Blog, Reviews, Multi-language
- Phase 3: User accounts, Advanced features
- Phase 4: Mobile app (long-term)

### **Success Metrics:**
- Conversion rate: 3%+ target
- Average order value: €15+
- Cart abandonment: <50%
- Page speed: 90+ Lighthouse score
- Mobile traffic: 60%+ of total

---

## 13. CONTACT & COLLABORATION

### **Project Point of Contact:**
Name: [Your Name]
Email: [Your Email]
Phone: [Your Phone]
Preferred Communication: [Email/WhatsApp/Slack]

### **Meeting Schedule:**
- Weekly check-ins (30 min)
- Design review (1 hour)
- Development review (1 hour)
- Final walkthrough (1 hour)

### **File Sharing:**
- Design files: Google Drive / Figma
- Development: GitHub repository
- Assets: Google Drive folder
- Communication: [Preferred platform]

---

## 14. QUESTIONS FOR DEVELOPER

Please answer these before starting:

1. **Portfolio:** Can you share 2-3 similar projects?
2. **Timeline:** Can you meet the 5-week timeline?
3. **Tech Stack:** Do you agree with the proposed stack?
4. **Revisions:** How many rounds of revisions included?
5. **Post-Launch:** Do you offer support? What's the cost?
6. **CMS:** Do you recommend adding a CMS? Which one?
7. **Hosting:** Can you handle deployment?
8. **Payment:** What payment gateway do you recommend?
9. **Backup:** What's your backup/version control process?
10. **Communication:** What's your preferred update frequency?

---

## 15. FINAL NOTES

### **Project Philosophy:**
This is not just a website. It's a platform for:
- Empowering Syrian widows
- Preserving cultural heritage
- Telling powerful stories
- Creating meaningful commerce

**Every pixel should honor these women's dignity.**
**Every interaction should feel premium yet warm.**
**Every purchase should feel like joining a legacy.**

---

## 📎 ATTACHMENTS

Please find attached:
1. Brand guidelines PDF (if available)
2. Logo files (PNG, SVG)
3. Sample product images
4. Competitor analysis
5. Content document

---

**Thank you for considering this project!**

We're excited to work with you to bring Zenobia's Legacy to life online.

**Let's build something beautiful together.** 🚀

---

**Document Version:** 1.0
**Date:** November 2025
**Status:** Ready for Review

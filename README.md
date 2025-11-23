# 🌟 SHAM - منصة شام للتمويل الجماعي

<div dir="rtl">

منصة شاملة تربط رواد الأعمال السوريين في الداخل بالمستثمرين السوريين في الشتات من خلال نموذج Equity Crowdfunding المبني على تقنية Blockchain.

</div>

## 🎯 الهدف من المشروع

**مشكلة:**
- رواد الأعمال في سوريا يواجهون صعوبة في الحصول على التمويل
- المغتربون السوريون يريدون المساهمة في إعادة بناء بلدهم
- عدم وجود منصة موثوقة تجمعهم

**الحل:**
منصة شام تقدم:
- ✅ تمويل جماعي شفاف ومبني على Blockchain
- ✅ NFTs تمثل ملكية الأسهم
- ✅ مساعد AI (شام) للدعم والإرشاد
- ✅ نظام mentoring من المستثمرين
- ✅ تقييم ذكي للمخاطر
- ✅ كشف احتيال تلقائي

---

## 🏗️ المعمارية التقنية

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Web App │  │Mobile App│  │Admin Panel│ │
│  │ (React)  │  │(Flutter) │  │  (React)  │ │
│  └────┬─────┘  └────┬─────┘  └────┬──────┘ │
└───────┼─────────────┼─────────────┼─────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
        ┌─────────────▼───────────────────┐
        │   API GATEWAY (Kong)             │
        └─────────────┬───────────────────┘
                      │
        ┌─────────────▼───────────────────┐
        │      MICROSERVICES LAYER         │
        │  ┌────────┐  ┌────────┐         │
        │  │ User   │  │Project │         │
        │  │Service │  │Service │         │
        │  └────────┘  └────────┘         │
        │  ┌────────┐  ┌────────┐         │
        │  │Invest  │  │Payment │         │
        │  │Service │  │Service │         │
        │  └────────┘  └────────┘         │
        │  ┌────────┐  ┌────────┐         │
        │  │  AI    │  │Blockchain│       │
        │  │Service │  │Service  │        │
        │  └────────┘  └────────┘         │
        └─────────────┬───────────────────┘
                      │
        ┌─────────────▼───────────────────┐
        │         DATA LAYER               │
        │  ┌──────┐ ┌──────┐ ┌──────┐   │
        │  │Postgres│ │MongoDB│ │Redis │   │
        │  └──────┘ └──────┘ └──────┘   │
        │  ┌──────┐ ┌──────┐             │
        │  │Polygon│ │ IPFS │             │
        │  └──────┘ └──────┘             │
        └────────────────────────────────┘
```

## 🚀 البدء السريع

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📚 التوثيق الكامل

- [Frontend Documentation](./frontend/README.md) - Coming Soon
- [Backend Documentation](./backend/README.md) - ✅ Ready
- [Architecture Guide](./docs/ARCHITECTURE.md) - Coming Soon

## 🔑 المميزات الرئيسية

✅ نظام مستخدمين كامل مع 2FA
✅ Sham AI Chatbot للدعم
✅ Risk Assessment ذكي
✅ Fraud Detection تلقائي
✅ Smart Contracts على Polygon
✅ NFTs لملكية الأسهم

## 📞 التواصل

- Email: info@sham.sy
- GitHub: github.com/sham-platform

---

Made with ❤️ for Syrian Entrepreneurs
# 🛒 বাজার দর (BazarDor)

> বাংলাদেশের বাজারের দাম আপডেট প্ল্যাটফর্ম - প্রয়োজনীয় পণ্যের দাম এক নজরে

![BazarDor](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![BetterAuth](https://img.shields.io/badge/BetterAuth-Latest-purple?style=for-the-badge)

## 📖 কি হলো বাজার দর?

**বাজার দর** হলো একটি আধুনিক ওয়েব অ্যাপ্লিকেশন যা বাংলাদেশের বিভিন্ন বাজারের পণ্যের দাম রিয়েল-টাইমে প্রদান করে। ব্যবহারকারীরা সহজেই চাল, ডাল, সবজি, মাছ, মাংস, ডিম, মশলা ও তেলের আজকের দাম জানতে পারবেন।

## ✨ প্রধান ৫ টি ফিচার

| ফিচার | বর্ণনা |
|----------|---------|
| 🏠 **হোম পেজের দাম সেকশন** | আজ দাম বেড়েছে ▲, আজ দাম কমেছে ▼, ও সব পণ্য - Troisটি আলাদা সেকশনে পণ্য প্রদর্শন |
| 📦 **প্রোডাক্ট ডিটেইলস পেজ** | প্রতিটি পণ্যের বিস্তারিত দাম, বাজারভিত্তিক দাম, পরিসংখ্যান (Min/Max/Avg) |
| 🏷️ **ক্যাটেগরি পেজ** | সাজান ড্রপডাউন (ডিফল্ট/দাম: কম থেকে বেশি/দাম: বেশি থেকে কম), লোডিং স্কেলেটন, খালি স্টেট |
| 🔐 **অথেন্টিকেশন** | BetterAuth দিয়ে ইমেইল/পাসওয়ার্ড + Google + GitHub সোশ্যাল লগইন, টোস্ট নোটিফিকেশন |
| 📱 **ফুল রেসপন্সিভ** | মোবাইল, ট্যাবলেট ও ডেস্কটপে সঠিক কাজ করে - ন্যাভবার, টিকার, হিরো, গ্রিড সব রেসপন্সিভ |

## 🛠️ ব্যবহৃত টেকনোলজি

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: BetterAuth (Email/Password + Google + GitHub OAuth)
- **Notifications**: react-hot-toast
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, date-fns (Bangla locale)
- **API**: Custom API with fallback (api-store.workers.dev / abcz.workers.dev)

## 🚀 দ্রুত শুরু

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone <repository-url>
cd bazar-dor
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ করুন
```bash
cp .env.example .env.local
```
`.env.local` ফাইলটি খুলে আপনার Google ও GitHub OAuth credentials যোগ করুন।

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```
 ব্রাউজারে [http://localhost:3000](http://localhost:3000) খুলুন।

## 📁 প্রজেক্ট কাঠামো

```
src/
├── app/
│   ├── (auth)/              # Auth route group
│   ├── api/auth/            # BetterAuth API routes
│   ├── category/[slug]/     # Category page
│   ├── product/[slug]/      # Product detail page (protected)
│   ├── profile/update/      # Profile update page (Challenge C3)
│   ├── signin/              # Sign in page
│   ├── signup/              # Sign up page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── components/
│   ├── Button.tsx           # Reusable button component
│   ├── Footer.tsx           # Footer component
│   ├── Navbar.tsx           # Navbar with ticker
│   ├── ProductCard.tsx      # Product card component
│   └── ProductSkeleton.tsx  # Loading skeletons
├── lib/
│   ├── api.ts               # API utilities with fallback
│   ├── auth.ts              # BetterAuth configuration
│   ├── date.ts              # Bangla date utilities
│   └── utils.ts             # cn() utility
├── types/
│   └── index.ts             # TypeScript types & Bengali digit helpers
└── middleware.ts            # Protected route middleware
```

## 🔌 API এন্ডপয়েন্ট

| এন্ডপয়েন্ট | বর্ণনা |
|------------|---------|
| `GET /api/bazardor/products` | সব পণ্য |
| `GET /api/bazardor/products?category=chal` | ক্যাটেগরির পণ্য |
| `GET /api/bazardor/products/1` | সিঙ্গেল পণ্য |
| `GET /api/bazardor/categories` | সব ক্যাটেগরি |
| `GET /api/bazardor/categories/chal` | সিঙ্গেল ক্যাটেগরি |

**বেস ইউআরএল:**
- Primary: `https://api.api-store.workers.dev/api/bazardor`
- Fallback: `https://api.abcz.workers.dev/api/bazardor`

## 🎯 চ্যালেঞ্জ ফিচার

### C1: সোর্ট ড্রপডাউন
ক্যাটেগরি পেজে "সাজান" ড্রপডাউন বähne বাঙালি সংখ্যা সঠিকভাবে সোর্ট করে।

### C3: প্রোফাইল আপডেট
`/profile/update` রুটে ব্যবহারকারী নাম আপডেট করতে পারেন (BetterAuth `updateUser` API ব্যবহার করে)।

## 📱 রেসপন্সিভ ব্রেকপয়েন্ট

| ডিভাইস | ব্রেকপয়েন্ট | কলাম |
|---------|-------------|-------|
| মোবাইল | `< 640px` | ১ কলাম |
| ট্যাবলেট | `640px - 1024px` | ২ কলাম |
| ডেস্কটপ | `> 1024px` | ৩-৪ কলাম |

## 🚀 ডিপ্লয়মেন্ট (Vercel)

১. Vercel-এ প্রজেক্ট ইম্পোর্ট করুন
২. Environment Variables যোগ করুন:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (production URL)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
৩. ডিপ্লয় করুন

> **দ্রষ্টব্য**: Dynamic routes (`[slug]`) Vercel-এ রিফ্রেশ করলেও 404 দেবে না।

## 📝 লাইসেন্স

এই প্রজেক্টটি শैक्षिणিক উদ্দেশ্যে তৈরি করা হয়েছে।

---

**বিকাশকারী**: B14 Assignment Team  
**ডেডলাইন**: ১০ অক্টোবর ২০২৬ (৬০ মার্কের জন্য)
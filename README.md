# SouqLink - منصة تجارة إلكترونية

منصة B2C تربط التجار بالمشترين عبر WhatsApp، مبنية بـ Next.js و Prisma و SQLite.

---

## 📋 المتطلبات

- Node.js 18 أو أحدث
- npm

---

## 🚀 طريقة التشغيل المحلي

### 1. استنساخ المشروع

```bash
git clone https://github.com/ahmedmontser312-gif/Souqlink.git
cd Souqlink
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع بالمحتوى التالي:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ضع-قيمة-عشوائية-طويلة-هنا

NEXT_PUBLIC_APP_NAME=SouqLink
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ لا ترفع ملف `.env.local` على GitHub أبداً — وهو مُضاف تلقائياً في `.gitignore`.

لتوليد `NEXTAUTH_SECRET` آمن:
```bash
openssl rand -base64 32
```

### 4. إنشاء قاعدة البيانات

```bash
npx prisma db push
```

### 5. إنشاء حساب الأدمن

```bash
npm run seed
```

يُنشئ هذا الأمر: `admin@souqlink.com` / `admin123`

> ⚠️ **غيّر كلمة المرور فور تسجيل الدخول في بيئة الإنتاج.**

### 6. إضافة بيانات تجريبية (اختياري)

```bash
node scripts/seed-demo.mjs
```

يُنشئ 4 متاجر و14 منتجاً تجريبياً مع حسابات تاجر جاهزة.

### 7. تشغيل الخادم

```bash
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

---

## 🔑 الحسابات الافتراضية

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|------------------|-------------|
| مدير (Admin) | admin@souqlink.com | admin123 |
| تاجر 1 | ahmed@demo.com | demo1234 |
| تاجر 2 | sara@demo.com | demo1234 |
| تاجر 3 | mona@demo.com | demo1234 |
| تاجر 4 | omar@demo.com | demo1234 |

> هذه الحسابات تُنشأ فقط عند تشغيل `seed-demo.mjs`

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── (auth)/          # صفحات تسجيل الدخول والتسجيل
│   ├── admin/           # لوحة تحكم الأدمن
│   ├── merchant/        # لوحة تحكم التاجر
│   ├── product/[id]/    # صفحة المنتج
│   ├── store/[slug]/    # صفحة المتجر
│   └── api/             # API endpoints
├── components/          # مكونات React
└── lib/                 # إعدادات Prisma، Auth، utils
prisma/
├── schema.prisma        # مخطط قاعدة البيانات
scripts/
├── seed.mjs             # إنشاء حساب الأدمن
└── seed-demo.mjs        # بيانات تجريبية شاملة
```

---

## ✅ التعديلات التي تمت (v1)

### إصلاحات حرجة

1. **خلل `_id` مقابل `id`** — المشروع نُقل من MongoDB إلى Prisma/SQLite لكن الواجهة ظلت تستخدم `_id`. تم إصلاحه في:
   - `ProductCard.tsx` — روابط `/product/undefined` أصبحت تعمل
   - `ProductSlider.tsx`
   - `store/[slug]/page.tsx` — صفحة المتجر تحمّل المنتجات الآن
   - `merchant/dashboard/page.tsx` — عدّاد المنتجات يعمل
   - `merchant/products/page.tsx` — عمليات إضافة/تعديل/حذف المنتجات
   - `admin/products/page.tsx` و `admin/merchants/page.tsx`

2. **سكربت `dev` معطّل** — حُذف `--no-turbopack` غير المدعوم في Next.js 16 من `package.json`.

### إصلاحات أمنية

3. **`.gitignore` غير مكتمل** — أُضيفت قواعد شاملة تشمل:
   - `.env.local` و جميع ملفات البيئة
   - ملفات قاعدة البيانات SQLite (`*.db`)
   - مجلد `.next/`
   - ملفات اللوغ والتطوير

4. **`.env.local` في Git** — تم تنفيذ `git rm --cached .env.local` لإزالته من التتبع.

5. **`/api/upload` بدون مصادقة** — أُضيف فحص الجلسة `getServerSession` لمنع الرفع غير المصرح به.

### إصلاحات منطق العمل

6. **المنتجات من متاجر غير معتمدة** — `GET /api/products` يُخفي الآن منتجات المتاجر التي لم يوافق عليها الأدمن (`approved: false`) للزوار العاديين.

### تحسينات الأداء

7. **الصفحة الرئيسية** — من 9 طلبات API منفصلة إلى طلب واحد عبر endpoint جديد `/api/home` يجمع كل البيانات في استعلام موازٍ.

### تنظيف

8. حُذفت ملفات التطوير غير المناسبة: `dev-server.log`، `dev-server.err`، `response.html`.

---

## ⚠️ ملاحظات مهمة للإنتاج

- **SQLite غير مناسب للإنتاج** على منصات مثل Vercel (نظام ملفات مؤقت). استخدم PostgreSQL أو MySQL.
- **غيّر `NEXTAUTH_SECRET`** إلى قيمة عشوائية قوية.
- **غيّر كلمة مرور الأدمن** `admin123` فور النشر.
- شغّل `npm audit fix` لمعالجة الثغرات الأمنية المعروفة.

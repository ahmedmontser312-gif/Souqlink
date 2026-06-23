import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data...");

  // Ensure admin exists
  const adminEmail = "admin@souqlink.com";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hashed = await bcrypt.hash("admin123", 10);
    admin = await prisma.user.create({
      data: { name: "Admin", email: adminEmail, password: hashed, role: "admin" },
    });
    console.log("Created admin:", adminEmail);
  } else {
    console.log("Admin already exists:", adminEmail);
  }

  // Create merchant users + stores + products
  const merchants = [
    {
      user: { name: "Ahmed Store", email: "ahmed@demo.com", password: "demo1234" },
      store: {
        name: "Ahmed Fashion",
        slug: "ahmed-fashion",
        description: "أحدث صيحات الموضة والملابس العصرية",
        whatsappNumber: "+201001234567",
        approved: true,
      },
      products: [
        { name: "قميص قطني كلاسيك", price: 299, category: "Clothes", description: "قميص قطني بجودة عالية متوفر بعدة ألوان", images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400"] },
        { name: "بنطلون جينز سليم", price: 450, category: "Clothes", description: "بنطلون جينز عصري بقصة سليم فيت", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"] },
        { name: "جاكيت شتوي دافئ", price: 850, category: "Clothes", description: "جاكيت شتوي مريح للأجواء الباردة", images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"] },
        { name: "تيشيرت رياضي", price: 199, category: "Clothes", description: "تيشيرت رياضي خفيف ومناسب للتمارين", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"] },
      ],
    },
    {
      user: { name: "Sara Electronics", email: "sara@demo.com", password: "demo1234" },
      store: {
        name: "Sara Tech",
        slug: "sara-tech",
        description: "أحدث الأجهزة الإلكترونية والاكسسوارات التقنية",
        whatsappNumber: "+201112345678",
        approved: true,
      },
      products: [
        { name: "سماعة لاسلكية بلوتوث", price: 650, category: "Electronics", description: "سماعة بلوتوث بجودة صوت عالية وبطارية 20 ساعة", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"] },
        { name: "شاحن لاسلكي سريع", price: 320, category: "Electronics", description: "شاحن لاسلكي 15W يدعم جميع الأجهزة", images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400"] },
        { name: "كيبورد ميكانيكي", price: 1200, category: "Electronics", description: "كيبورد ميكانيكي RGB للألعاب والعمل", images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"] },
        { name: "ماوس لاسلكي", price: 380, category: "Electronics", description: "ماوس لاسلكي دقيق وخفيف الوزن", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"] },
      ],
    },
    {
      user: { name: "Mona Home", email: "mona@demo.com", password: "demo1234" },
      store: {
        name: "Mona Home Decor",
        slug: "mona-home",
        description: "ديكورات وإكسسوارات المنزل بأسعار مناسبة",
        whatsappNumber: "+201223456789",
        approved: true,
      },
      products: [
        { name: "إطار صور خشبي", price: 150, category: "Home", description: "إطار صور خشبي أنيق لتزيين المنزل", images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400"] },
        { name: "وسادة زينة مخملية", price: 220, category: "Home", description: "وسادة مخملية ناعمة بألوان متنوعة", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"] },
        { name: "شمعة معطرة فاخرة", price: 180, category: "Home", description: "شمعة معطرة بعطر الفانيليا والخشب", images: ["https://images.unsplash.com/photo-1602607917858-b75abb99d75c?w=400"] },
      ],
    },
    {
      user: { name: "Omar Sports", email: "omar@demo.com", password: "demo1234" },
      store: {
        name: "Omar Sports Hub",
        slug: "omar-sports",
        description: "كل ما تحتاجه للرياضة والتمارين",
        whatsappNumber: "+201334567890",
        approved: true,
      },
      products: [
        { name: "حذاء رياضي للجري", price: 980, category: "Sports", description: "حذاء رياضي خفيف ومريح لسباقات الجري", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"] },
        { name: "حقيبة رياضية", price: 420, category: "Sports", description: "حقيبة رياضية واسعة مع جيوب متعددة", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"] },
        { name: "قفازات تمارين", price: 175, category: "Sports", description: "قفازات للتمارين بمقبض قوي ومريح", images: ["https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=400"] },
      ],
    },
  ];

  for (const m of merchants) {
    let user = await prisma.user.findUnique({ where: { email: m.user.email } });
    if (!user) {
      const hashed = await bcrypt.hash(m.user.password, 10);
      user = await prisma.user.create({
        data: { name: m.user.name, email: m.user.email, password: hashed, role: "merchant" },
      });
      console.log("Created merchant:", m.user.email);
    }

    let store = await prisma.store.findUnique({ where: { slug: m.store.slug } });
    if (!store) {
      store = await prisma.store.create({
        data: { ...m.store, ownerId: user.id },
      });
      console.log("Created store:", store.name);
    }

    for (const prod of m.products) {
      const existing = await prisma.product.findFirst({
        where: { storeId: store.id, name: prod.name },
      });
      if (!existing) {
        const slug = prod.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-").replace(/^-|-$/g, "");
        await prisma.product.create({
          data: {
            name: prod.name,
            slug,
            price: prod.price,
            description: prod.description,
            category: prod.category,
            whatsappNumber: m.store.whatsappNumber,
            storeId: store.id,
            storeName: store.name,
            images: { create: prod.images.map((url) => ({ url })) },
          },
        });
        console.log("  + Product:", prod.name);
      }
    }
  }

  const [u, s, pr] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.product.count(),
  ]);
  console.log(`\nDone! Users: ${u} | Stores: ${s} | Products: ${pr}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

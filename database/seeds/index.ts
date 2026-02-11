/**
 * Database Seed Script
 * Seeds initial data for modules, achievements, and sample content
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ============================================
  // SEED MODULES - HEALING PHASE
  // ============================================
  console.log('📚 Seeding healing phase modules...');

  const healingModules = [
    {
      phase: 'healing',
      category: 'breathing',
      titleAr: 'التنفس العميق - الأساسيات',
      titleEn: 'Deep Breathing - Basics',
      descriptionAr: 'تعلم كيفية التنفس العميق لتهدئة الجهاز العصبي وتخفيف التوتر',
      descriptionEn: 'Learn deep breathing to calm your nervous system and reduce stress',
      contentType: 'interactive',
      durationMinutes: 5,
      orderIndex: 1,
      difficultyLevel: 1,
      textContent: `
# التنفس العميق - تمرين الأساسيات

## لماذا التنفس العميق؟
عندما نكون قلقين أو خائفين، يصبح تنفسنا سريعاً وسطحياً. التنفس العميق يساعد على:
- تهدئة الجهاز العصبي
- تقليل القلق والتوتر
- تحسين التركيز

## كيف نتنفس بعمق؟
1. اجلس أو استلقِ بوضعية مريحة
2. ضع يدك على بطنك
3. استنشق ببطء من أنفك (عد إلى 4)
4. احبس النفس قليلاً (عد إلى 2)
5. أخرج الهواء ببطء من فمك (عد إلى 6)
6. كرر 5-10 مرات

## جرب الآن!
ابدأ التمرين التفاعلي أدناه 👇
      `,
      hasQuiz: false,
    },
    {
      phase: 'healing',
      category: 'mindfulness',
      titleAr: 'التأمل الموجه - اللحظة الحالية',
      titleEn: 'Guided Meditation - Present Moment',
      descriptionAr: 'تمرين قصير للعودة إلى اللحظة الحالية والشعور بالأمان',
      descriptionEn: 'Short exercise to return to the present moment and feel safe',
      contentType: 'audio',
      durationMinutes: 10,
      orderIndex: 2,
      difficultyLevel: 1,
      textContent: `
# التأمل الموجه - اللحظة الحالية

## ما هو التأمل؟
التأمل ليس إفراغ العقل، بل ملاحظة أفكارنا دون حكم عليها.

## لماذا التأمل مهم؟
- يساعد على تقليل القلق
- يحسن التركيز
- يزيد الشعور بالهدوء

## تمرين الـ 10 دقائق
استمع إلى التسجيل الصوتي أدناه، حيث سيقودك شام في رحلة قصيرة للعودة إلى اللحظة الحالية.
      `,
      hasQuiz: false,
    },
    {
      phase: 'healing',
      category: 'grounding',
      titleAr: 'تقنية الـ 5-4-3-2-1 للتأريض',
      titleEn: '5-4-3-2-1 Grounding Technique',
      descriptionAr: 'تقنية سريعة للتعامل مع القلق والذعر باستخدام الحواس الخمس',
      descriptionEn: 'Quick technique to manage anxiety and panic using five senses',
      contentType: 'text',
      durationMinutes: 5,
      orderIndex: 3,
      difficultyLevel: 1,
      textContent: `
# تقنية الـ 5-4-3-2-1 للتأريض

## متى نستخدم هذه التقنية؟
عندما تشعر بـ:
- قلق شديد
- نوبة ذعر
- انفصال عن الواقع
- ذكريات مؤلمة تعود

## كيف تعمل؟
استخدم حواسك الخمس للعودة إلى اللحظة الحالية:

### 5 أشياء تراها 👀
انظر حولك وحدد 5 أشياء. مثلاً:
- الساعة على الحائط
- كوب الماء على الطاولة
- الضوء القادم من النافذة
- نبتة في الغرفة
- يدك

### 4 أشياء تلمسها 🤚
المس 4 أشياء وانتبه للإحساس:
- ملمس الكرسي تحتك
- النسيج الناعم لملابسك
- برودة الطاولة
- دفء هاتفك

### 3 أشياء تسمعها 👂
أغمض عينيك واستمع:
- صوت سيارة بعيدة
- صوت تنفسك
- صوت الرياح

### 2 أشياء تشمها 👃
- رائحة القهوة
- رائحة الهواء النقي

### 1 شيء تتذوقه 👅
- طعم الماء
- طعم فمك

## النتيجة
بعد هذا التمرين، ستشعر بأنك أكثر اتصالاً باللحظة الحالية وأقل قلقاً.
      `,
      hasQuiz: false,
    },
  ];

  for (const module of healingModules) {
    await prisma.module.create({ data: module });
  }

  console.log(`✅ Created ${healingModules.length} healing modules`);

  // ============================================
  // SEED MODULES - LEARNING PHASE
  // ============================================
  console.log('📚 Seeding learning phase modules...');

  const learningModules = [
    {
      phase: 'learning',
      category: 'customer_service',
      titleAr: 'أساسيات خدمة العملاء',
      titleEn: 'Customer Service Basics',
      descriptionAr: 'تعلم كيفية التواصل الاحترافي مع العملاء عبر الإنترنت',
      descriptionEn: 'Learn professional online customer communication',
      contentType: 'video',
      durationMinutes: 30,
      orderIndex: 1,
      difficultyLevel: 1,
      textContent: `
# أساسيات خدمة العملاء

## ما هي خدمة العملاء؟
خدمة العملاء هي مساعدة الناس في حل مشاكلهم بطريقة ودية واحترافية.

## لماذا هذه المهارة مطلوبة؟
- آلاف الشركات تبحث عن موظفي خدمة عملاء
- يمكن العمل من المنزل
- لا تحتاج خبرة سابقة
- الدخل جيد (300-600$ شهرياً)

## ماذا ستتعلم؟
1. كيفية الرد على العملاء باحترافية
2. التعامل مع العملاء الغاضبين
3. استخدام أدوات خدمة العملاء
4. كتابة رسائل واضحة ومهذبة

## المهارات المطلوبة
- لغة إنجليزية جيدة (أو عربية)
- صبر واستماع جيد
- سرعة في الكتابة
      `,
      hasQuiz: true,
      quizQuestions: [
        {
          question: 'ما هو أهم شيء في خدمة العملاء؟',
          options: [
            'السرعة في الرد',
            'الاستماع وفهم المشكلة',
            'معرفة كل الإجابات',
            'استخدام لغة رسمية',
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      phase: 'learning',
      category: 'writing',
      titleAr: 'الكتابة بالعربية للمحتوى الرقمي',
      titleEn: 'Arabic Content Writing',
      descriptionAr: 'تعلم كتابة محتوى جذاب وواضح للمواقع ووسائل التواصل',
      descriptionEn: 'Learn to write engaging Arabic content for websites and social media',
      contentType: 'text',
      durationMinutes: 40,
      orderIndex: 2,
      difficultyLevel: 2,
      prerequisites: [],
      textContent: `
# الكتابة بالعربية للمحتوى الرقمي

## ما هي كتابة المحتوى؟
كتابة نصوص للمواقع الإلكترونية، المدونات، وسائل التواصل الاجتماعي.

## لماذا المحتوى العربي مطلوب؟
- نقص الكتّاب العرب الجيدين
- آلاف المواقع تحتاج محتوى عربي
- الدفع جيد (من 5$ للمقال القصير)

## أنواع المحتوى
1. مقالات المدونات
2. أوصاف المنتجات
3. منشورات وسائل التواصل
4. البريد الإلكتروني التسويقي

## كيف تكتب محتوى جيد؟
1. ابدأ بعنوان جذاب
2. اكتب بلغة بسيطة وواضحة
3. استخدم فقرات قصيرة
4. أضف قيمة للقارئ
      `,
      hasQuiz: true,
    },
  ];

  for (const module of learningModules) {
    await prisma.module.create({ data: module });
  }

  console.log(`✅ Created ${learningModules.length} learning modules`);

  // ============================================
  // SEED ACHIEVEMENTS
  // ============================================
  console.log('🏆 Seeding achievements...');

  const achievements = [
    {
      nameAr: 'البداية 🌱',
      nameEn: 'The Beginning',
      descriptionAr: 'أكملت أول طقس يومي',
      descriptionEn: 'Completed your first daily ritual',
      icon: '🌱',
      category: 'streak',
      requirementType: 'daily_rituals',
      requirementValue: 1,
      level: 1,
      points: 10,
    },
    {
      nameAr: 'أسبوع كامل 🔥',
      nameEn: 'One Week Streak',
      descriptionAr: '7 أيام متواصلة من النشاط',
      descriptionEn: '7 consecutive days of activity',
      icon: '🔥',
      category: 'streak',
      requirementType: 'streak_days',
      requirementValue: 7,
      level: 2,
      points: 50,
    },
    {
      nameAr: 'شهر النهضة 🌟',
      nameEn: 'Renaissance Month',
      descriptionAr: '30 يوم متواصل - أنت بطل!',
      descriptionEn: '30 consecutive days - You are a hero!',
      icon: '🌟',
      category: 'streak',
      requirementType: 'streak_days',
      requirementValue: 30,
      level: 3,
      points: 200,
    },
    {
      nameAr: 'الطالب المجتهد 📚',
      nameEn: 'Diligent Student',
      descriptionAr: 'أكملت 5 وحدات تعليمية',
      descriptionEn: 'Completed 5 learning modules',
      icon: '📚',
      category: 'modules',
      requirementType: 'modules_completed',
      requirementValue: 5,
      level: 1,
      points: 30,
    },
    {
      nameAr: 'الخبير 🎓',
      nameEn: 'The Expert',
      descriptionAr: 'أكملت 20 وحدة تعليمية',
      descriptionEn: 'Completed 20 learning modules',
      icon: '🎓',
      category: 'modules',
      requirementType: 'modules_completed',
      requirementValue: 20,
      level: 2,
      points: 100,
    },
    {
      nameAr: 'أول دخل 💰',
      nameEn: 'First Earning',
      descriptionAr: 'حصلت على أول دفعة!',
      descriptionEn: 'Received your first payment!',
      icon: '💰',
      category: 'earning',
      requirementType: 'total_earned',
      requirementValue: 1,
      level: 1,
      points: 100,
    },
    {
      nameAr: 'الاجتماعي 👥',
      nameEn: 'Social Butterfly',
      descriptionAr: 'انضممت إلى 3 مجموعات دعم',
      descriptionEn: 'Joined 3 support groups',
      icon: '👥',
      category: 'community',
      requirementType: 'groups_joined',
      requirementValue: 3,
      level: 1,
      points: 20,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // ============================================
  // SEED COMMUNITY GROUPS
  // ============================================
  console.log('👥 Seeding community groups...');

  const groups = [
    {
      nameAr: 'دائرة الشفاء 🕊️',
      nameEn: 'Healing Circle',
      descriptionAr: 'مجموعة دعم للتعافي النفسي ومشاركة التجارب',
      descriptionEn: 'Support group for psychological recovery and sharing experiences',
      icon: '🕊️',
      groupType: 'support',
      category: 'healing',
      maxMembers: 50,
      isPrivate: false,
      requiresApproval: true,
    },
    {
      nameAr: 'دائرة المحترفين 💼',
      nameEn: 'Professionals Circle',
      descriptionAr: 'للمحترفين والباحثين عن عمل - نصائح وفرص',
      descriptionEn: 'For professionals and job seekers - tips and opportunities',
      icon: '💼',
      groupType: 'professional',
      category: 'earning',
      maxMembers: 100,
      isPrivate: false,
      requiresApproval: false,
    },
    {
      nameAr: 'متعلمو خدمة العملاء 📞',
      nameEn: 'Customer Service Learners',
      descriptionAr: 'لمن يتعلمون ويعملون في خدمة العملاء',
      descriptionEn: 'For those learning and working in customer service',
      icon: '📞',
      groupType: 'learning',
      category: 'learning',
      maxMembers: 75,
      isPrivate: false,
      requiresApproval: false,
    },
  ];

  for (const group of groups) {
    await prisma.communityGroup.create({ data: group });
  }

  console.log(`✅ Created ${groups.length} community groups`);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

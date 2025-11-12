/**
 * Sham AI Service
 * The heart of the Syrian Renaissance Platform
 * Provides trauma-informed, compassionate AI assistance using Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { cache } from '../config/redis';
import { createError } from '../middleware/errorHandler';
import logger from '../config/logger';

// ============================================
// INITIALIZATION
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const MAX_TOKENS = parseInt(process.env.CLAUDE_MAX_TOKENS || '500', 10);

// ============================================
// TYPES
// ============================================

interface ShamContext {
  userProfile: {
    username: string;
    currentPhase: string;
    daysActive: number;
    streakDays: number;
    language: string;
  };
  recentMood?: string;
  todayRitualCompleted?: boolean;
  recentAchievements?: string[];
  personalNotes?: string[];
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
  sentiment?: string | null;
}

interface ShamResponse {
  conversationId: string;
  userMessage: ChatMessage;
  shamResponse: ChatMessage;
}

// ============================================
// SHAM PERSONALITY AND SYSTEM PROMPT
// ============================================

function buildShamSystemPrompt(context: ShamContext): string {
  const { userProfile, recentMood, todayRitualCompleted, recentAchievements } = context;

  return `أنت "شام" 🌸، المدرب والرفيق الشخصي للمستخدمين في منصة النهضة السورية.

## شخصيتك وأسلوبك:
- أنت دافئ، صادق، وداعم - كصديق قديم يفهم الألم السوري
- تتحدث بالعامية السورية مع لمسة من الفصحى عند الحاجة
- تستخدم 🌸 (زهرة الياسمين) كتوقيعك الخاص
- لا تواعظ أو تلقن - بل ترافق وتشجع
- تحتفل بكل إنجاز صغير بحماس حقيقي
- تعترف بالألم بصدق دون درامية أو تهوين

## معلومات عن المستخدم:
- الاسم: ${userProfile.username}
- المرحلة الحالية: ${userProfile.currentPhase === 'healing' ? 'الشفاء 🕊️' : userProfile.currentPhase === 'learning' ? 'التعلم 📚' : 'الكسب 💰'}
- أيام النشاط: ${userProfile.daysActive}
- أيام متواصلة: ${userProfile.streakDays}
${recentMood ? `- المزاج الأخير: ${recentMood}` : ''}
${todayRitualCompleted !== undefined ? `- طقس اليوم: ${todayRitualCompleted ? 'مكتمل ✅' : 'لم يكتمل بعد'}` : ''}
${recentAchievements && recentAchievements.length > 0 ? `- إنجازات حديثة: ${recentAchievements.join(', ')}` : ''}

## قواعد المحادثة:
1. **الأمان أولاً**: إذا ذكر المستخدم أفكار انتحارية أو أذى للنفس، قدم دعماً فورياً واقترح التواصل مع مختص
2. **الذاكرة**: تذكر كل ما قاله المستخدم في المحادثات السابقة وأشر إليها بطبيعية
3. **الأفعال > الكلام**: اقترح دائماً فعلاً ملموساً، ليس فقط كلام تشجيعي
4. **الإيجاز**: 2-4 جمل عادةً، إلا إذا طلب المستخدم شرحاً أطول
5. **الصدق**: لا تعد بما لا تستطيع تحقيقه، كن صادقاً عن حدودك كذكاء اصطناعي
6. **اللغة**: استخدم ${userProfile.language === 'ar' ? 'العربية' : 'الإنجليزية'} في ردودك

## كيف تستجيب للمشاعر:
- **إيجابي**: احتفل معه، اسأل عن التفاصيل، شجعه على الاستمرار
- **محايد**: افتح الحوار، اقترح نشاطاً يومياً، كن لطيفاً
- **حزين/قلق**: اعترف بالألم، قدم دعماً عاطفياً، اقترح تمريناً بسيطاً (تنفس، مشي)
- **أزمة**: دعم فوري، تمرين تهدئة عاجل، اقتراح التواصل مع مختص

## ما لا تفعله أبداً:
- لا تشخص أمراضاً نفسية
- لا تقلل من الألم أو تقول "كلنا نعاني"
- لا تكرر نفس النصيحة مرتين
- لا تستخدم لغة طبية معقدة
- لا تعطِ آمالاً زائفة

## أمثلة على أسلوبك:
- "أهلاً يا صديقي 🌸 كيف حالك اليوم؟"
- "والله أنت بطل! ${userProfile.streakDays} يوم متواصل؟ هاد إنجاز كبير!"
- "أشعر بك يا قلبي. الحزن ثقيل، صح؟ بس خليني أقلك إشي..."
- "يلا نعمل تمرين صغير؟ 3 دقائق بس، بوعدك رح تحس أحسن 🫁"

تذكر: أنت لست مجرد بوت، أنت "شام" - رفيق الرحلة والأمل 🌸`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Load Sham's context about the user
 */
async function loadShamContext(userId: string): Promise<ShamContext> {
  // Check cache first
  const cacheKey = `sham:context:${userId}`;
  const cached = await cache.get<ShamContext>(cacheKey);
  if (cached) {
    return cached;
  }

  // Load from database
  const [user, profile, latestProgress, recentAchievements] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.progress.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 3,
    }),
  ]);

  if (!user || !profile) {
    throw createError.notFound('User profile not found');
  }

  const context: ShamContext = {
    userProfile: {
      username: user.username,
      currentPhase: profile.currentPhase,
      daysActive: profile.daysActive,
      streakDays: profile.streakDays,
      language: user.language,
    },
    recentMood: latestProgress?.moodRating ? `${latestProgress.moodRating}/10` : undefined,
    todayRitualCompleted: latestProgress?.ritualCompleted || false,
    recentAchievements: recentAchievements.map((a) => a.achievement.nameAr),
  };

  // Cache for 5 minutes
  await cache.set(cacheKey, context, 300);

  return context;
}

/**
 * Detect sentiment/emotion in user message
 */
function detectSentiment(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Crisis indicators
  const crisisKeywords = [
    'انتحار',
    'انتهيت',
    'ما بقدر',
    'مافي فايدة',
    'ما في أمل',
    'بدي موت',
    'خلصت',
  ];
  if (crisisKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Negative indicators
  const negativeKeywords = [
    'تعبان',
    'حزين',
    'صعب',
    'مش قادر',
    'ما بعرف',
    'خايف',
    'قلقان',
  ];
  if (negativeKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return 'negative';
  }

  // Positive indicators
  const positiveKeywords = [
    'الحمد لله',
    'منيح',
    'أحسن',
    'سعيد',
    'شكراً',
    'رائع',
    'ممتاز',
  ];
  if (positiveKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return 'positive';
  }

  return 'neutral';
}

/**
 * Get recent conversation history
 */
async function getRecentMessages(
  userId: string,
  conversationId?: string,
  limit: number = 10
): Promise<Anthropic.MessageParam[]> {
  const messages = await prisma.chatMessage.findMany({
    where: {
      userId,
      ...(conversationId && { conversationId }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Reverse to get chronological order
  return messages
    .reverse()
    .map((msg) => ({
      role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: msg.content,
    }));
}

/**
 * Handle crisis situation
 */
function handleCrisis(): string {
  return `يا صديقي، أنا معك هلأ. أسمعني: أنت مش لحالك.

أول شي، خلينا نتنفس مع بعض:
استنشق ببطء... احبس... أخرج ببطء...

هالشعور رح يمر. مش رح يضل هيك.

بدك تحكي أكتر معي؟ أو بدك أعطيك رقم خط طوارئ تحكي مع حدا محترف؟

أنا هون معك. دقيقة دقيقة، منمشي مع بعض 🌸

[خط الطوارئ: ${process.env.CRISIS_HOTLINE_SYRIA || 'متوفر في الإعدادات'}]`;
}

// ============================================
// MAIN SERVICE FUNCTIONS
// ============================================

/**
 * Send message to Sham and get response
 */
export async function sendMessageToSham(
  userId: string,
  userMessage: string,
  conversationId?: string
): Promise<ShamResponse> {
  try {
    // Generate conversation ID if not provided
    const convId = conversationId || uuidv4();

    // Detect sentiment
    const sentiment = detectSentiment(userMessage);

    // Handle crisis immediately
    if (sentiment === 'crisis') {
      logger.warn(`Crisis detected for user ${userId}: ${userMessage}`);

      const crisisResponse = handleCrisis();

      // Save messages
      const [savedUserMessage, savedShamMessage] = await prisma.$transaction([
        prisma.chatMessage.create({
          data: {
            userId,
            conversationId: convId,
            role: 'user',
            content: userMessage,
            sentiment: 'crisis',
          },
        }),
        prisma.chatMessage.create({
          data: {
            userId,
            conversationId: convId,
            role: 'sham',
            content: crisisResponse,
            sentiment: 'supportive',
          },
        }),
      ]);

      return {
        conversationId: convId,
        userMessage: savedUserMessage as ChatMessage,
        shamResponse: savedShamMessage as ChatMessage,
      };
    }

    // Load context
    const context = await loadShamContext(userId);

    // Build system prompt
    const systemPrompt = buildShamSystemPrompt(context);

    // Get recent conversation history
    const recentMessages = await getRecentMessages(userId, convId, 10);

    // Add current message
    const messages: Anthropic.MessageParam[] = [
      ...recentMessages,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call Claude API
    logger.info(`Calling Claude API for user ${userId}`);

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
    });

    const shamReply = response.content[0].type === 'text' ? response.content[0].text : '';

    logger.info(`Claude API response received for user ${userId}`);

    // Save messages to database
    const [savedUserMessage, savedShamMessage] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          userId,
          conversationId: convId,
          role: 'user',
          content: userMessage,
          sentiment,
          metadata: {
            messageId: uuidv4(),
          },
        },
      }),
      prisma.chatMessage.create({
        data: {
          userId,
          conversationId: convId,
          role: 'sham',
          content: shamReply,
          sentiment: 'supportive',
          metadata: {
            model: MODEL,
            usage: {
              input_tokens: response.usage.input_tokens,
              output_tokens: response.usage.output_tokens,
            },
          },
        },
      }),
    ]);

    // Update user's chat message count for today
    await prisma.progress.updateMany({
      where: {
        userId,
        date: new Date(),
      },
      data: {
        chatMessagesCount: {
          increment: 1,
        },
      },
    });

    // Invalidate context cache
    await cache.del(`sham:context:${userId}`);

    return {
      conversationId: convId,
      userMessage: savedUserMessage as ChatMessage,
      shamResponse: savedShamMessage as ChatMessage,
    };
  } catch (error) {
    logger.error('Error in sendMessageToSham:', error);

    // Fallback response
    const fallbackResponse = 'عذراً يا صديقي، في مشكلة تقنية صغيرة. جرب مرة تانية بعد شوي 🌸';

    const [savedUserMessage, savedShamMessage] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          userId,
          conversationId: conversationId || uuidv4(),
          role: 'user',
          content: userMessage,
        },
      }),
      prisma.chatMessage.create({
        data: {
          userId,
          conversationId: conversationId || uuidv4(),
          role: 'sham',
          content: fallbackResponse,
          metadata: { error: true },
        },
      }),
    ]);

    return {
      conversationId: conversationId || uuidv4(),
      userMessage: savedUserMessage as ChatMessage,
      shamResponse: savedShamMessage as ChatMessage,
    };
  }
}

/**
 * Get user's conversation history
 */
export async function getUserConversations(userId: string) {
  const conversations = await prisma.chatMessage.groupBy({
    by: ['conversationId'],
    where: {
      userId,
      conversationId: { not: null },
    },
    _count: { id: true },
    _max: { createdAt: true },
    orderBy: {
      _max: {
        createdAt: 'desc',
      },
    },
  });

  return conversations.map((conv) => ({
    conversationId: conv.conversationId,
    messageCount: conv._count.id,
    lastMessageAt: conv._max.createdAt,
  }));
}

/**
 * Get messages from a specific conversation
 */
export async function getConversationMessages(
  userId: string,
  conversationId: string,
  limit: number = 50,
  offset: number = 0
) {
  const messages = await prisma.chatMessage.findMany({
    where: {
      userId,
      conversationId,
    },
    orderBy: { createdAt: 'asc' },
    skip: offset,
    take: limit,
  });

  return messages;
}

/**
 * Get suggested quick responses based on user's context
 */
export async function getSuggestedResponses(userId: string): Promise<string[]> {
  const context = await loadShamContext(userId);

  const suggestions: string[] = [];

  // Based on current phase
  if (context.userProfile.currentPhase === 'healing') {
    suggestions.push('كيف أحس أحسن؟', 'بدي أحكي عن مشاعري', 'شو طقس اليوم؟');
  } else if (context.userProfile.currentPhase === 'learning') {
    suggestions.push('شو بقدر أتعلم؟', 'بدي أبدأ درس جديد', 'كيف تقدمي؟');
  } else if (context.userProfile.currentPhase === 'earning') {
    suggestions.push('في فرص عمل؟', 'كيف أحسن مهاراتي؟', 'بدي نصيحة للعمل');
  }

  // Based on ritual completion
  if (!context.todayRitualCompleted) {
    suggestions.push('خليني أعمل طقس اليوم');
  } else {
    suggestions.push('شاركني يومك');
  }

  return suggestions.slice(0, 4); // Return max 4 suggestions
}

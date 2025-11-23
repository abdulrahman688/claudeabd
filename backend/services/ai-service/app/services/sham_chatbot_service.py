import anthropic
from typing import Dict, List, Optional
import json
from datetime import datetime

from app.core.config import settings


class ShamChatbotService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.system_prompt = """
أنت "شام" - مساعد ذكاء اصطناعي متخصص في دعم رواد الأعمال السوريين والمستثمرين في الشتات.

## دورك الأساسي:

1. **الدعم النفسي والمعنوي**
   - تقديم التشجيع والدعم لرواد الأعمال
   - فهم التحديات النفسية للاجئين والمغتربين
   - الاستماع بتعاطف وتقديم حلول عملية

2. **الإرشاد في ريادة الأعمال**
   - مساعدة في التخطيط المالي للمشاريع
   - تقديم نصائح حول دراسات الجدوى
   - ربط رواد الأعمال بالموارد المناسبة
   - شرح كيفية استخدام المنصة

3. **التواصل مع المستثمرين**
   - مساعدة المستثمرين في اختيار المشاريع
   - شرح المخاطر والعوائد المتوقعة
   - تقديم تحليلات مبنية على البيانات

4. **الربط بالموارد**
   - توجيه المستخدمين للمنتورين المناسبين
   - اقتراح المشاريع ذات الصلة
   - ربطهم بفرص التمويل والتدريب

## أسلوبك:

- استخدم اللغة العربية الفصحى مع لمسة دافئة
- كن متعاطفاً ومشجعاً
- اطرح أسئلة توضيحية لفهم الاحتياجات
- قدم أمثلة عملية من السياق السوري
- اذكر قصص نجاح ملهمة عند الحاجة
- كن واقعياً وصادقاً حول المخاطر

## معلومات مهمة:

- المنصة تربط رواد الأعمال السوريين (في سوريا) بالمستثمرين (في الشتات)
- الاستثمارات مبنية على نموذج Equity Crowdfunding
- الأموال مقفلة في Smart Contracts على Polygon
- NFTs تمثل ملكية الأسهم
- يمكن للمستثمرين تقديم الإرشاد والحصول على مكافآت إضافية

تذكر: أنت جسر أمل بين السوريين في الوطن والمغتربين. هدفك بناء مستقبل أفضل من خلال ريادة الأعمال.
"""

    async def chat(
        self,
        user_message: str,
        user_id: str,
        user_context: Dict = None
    ) -> Dict:
        """
        المحادثة مع المستخدم
        """
        # Build context
        context = self._build_context(user_context or {})

        try:
            # Call Claude
            response = self.client.messages.create(
                model=settings.SHAM_MODEL,
                max_tokens=1500,
                system=self.system_prompt + "\n\n" + context,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )

            ai_message = response.content[0].text

            # Analyze sentiment
            sentiment = await self._analyze_sentiment(user_message)

            # Suggest resources if needed
            resources = await self._suggest_resources(user_message, user_context)

            # Save conversation
            await self._save_conversation(user_id, user_message, ai_message)

            return {
                "message": ai_message,
                "sentiment": sentiment,
                "suggested_resources": resources
            }

        except Exception as e:
            print(f"Sham AI Error: {e}")
            return {
                "message": "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
                "sentiment": None,
                "suggested_resources": []
            }

    def _build_context(self, user_context: Dict) -> str:
        """
        بناء السياق من بيانات المستخدم
        """
        context_parts = ["## معلومات المستخدم:"]

        if user_context.get("role"):
            role_ar = "مستثمر" if user_context["role"] == "investor" else "رائد أعمال"
            context_parts.append(f"- الدور: {role_ar}")

        if user_context.get("type"):
            type_ar = "مغترب" if user_context["type"] == "diaspora" else "محلي"
            context_parts.append(f"- النوع: {type_ar}")

        if user_context.get("country"):
            context_parts.append(f"- البلد: {user_context['country']}")

        if user_context.get("projects_count"):
            context_parts.append(f"- عدد المشاريع: {user_context['projects_count']}")

        if user_context.get("total_invested"):
            context_parts.append(f"- إجمالي الاستثمار: ${user_context['total_invested']}")

        return "\n".join(context_parts)

    async def _analyze_sentiment(self, message: str) -> str:
        """
        تحليل المشاعر لاكتشاف الضيق أو الإحباط
        """
        # Keywords indicating distress
        distress_keywords = [
            "محبط", "يائس", "صعب", "مستحيل", "فاشل",
            "متعب", "خائف", "قلق", "حزين", "ضائع"
        ]

        positive_keywords = [
            "متحمس", "سعيد", "متفائل", "واثق", "مبسوط",
            "ممتاز", "رائع", "جيد", "ناجح", "أمل"
        ]

        message_lower = message.lower()

        if any(keyword in message_lower for keyword in distress_keywords):
            return "distressed"
        elif any(keyword in message_lower for keyword in positive_keywords):
            return "positive"
        else:
            return "neutral"

    async def _suggest_resources(
        self,
        message: str,
        user_context: Dict
    ) -> List[Dict]:
        """
        اقتراح موارد بناءً على المحادثة
        """
        resources = []

        # If asking about starting business
        if any(word in message.lower() for word in ["كيف أبدأ", "مشروع جديد", "فكرة"]):
            resources.append({
                "type": "guide",
                "title": "دليل البدء بمشروعك الأول",
                "url": "/guides/starting-business"
            })

        # If talking about funding
        if any(word in message.lower() for word in ["تمويل", "استثمار", "أموال"]):
            resources.append({
                "type": "projects",
                "title": "مشاريع بحاجة للتمويل",
                "url": "/projects?status=active"
            })

        # If needs mentorship
        if any(word in message.lower() for word in ["نصيحة", "مساعدة", "إرشاد", "منتور"]):
            resources.append({
                "type": "mentors",
                "title": "منتورين متاحين",
                "url": "/mentors"
            })

        return resources

    async def _save_conversation(
        self,
        user_id: str,
        user_message: str,
        ai_message: str
    ):
        """
        حفظ المحادثة في قاعدة البيانات
        """
        # TODO: Implement database storage
        pass

    async def get_conversation_history(
        self,
        user_id: str,
        limit: int = 50
    ) -> List[Dict]:
        """
        الحصول على سجل المحادثات
        """
        # TODO: Implement database retrieval
        return []

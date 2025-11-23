import numpy as np
from typing import Dict, List
import anthropic

from app.core.config import settings


class RiskAssessmentService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        # Risk weights for different factors
        self.risk_weights = {
            "location": 0.25,
            "funding_goal": 0.20,
            "owner_experience": 0.20,
            "timeline": 0.15,
            "category": 0.20,
        }

    async def assess_project_risk(self, project_data: Dict) -> Dict:
        """
        تقييم مخاطر المشروع
        """
        risk_factors = []
        total_risk_score = 0.0

        # 1. Location Risk
        location_risk = self._assess_location_risk(project_data["location"])
        risk_factors.append({
            "factor": "الموقع الجغرافي",
            "impact": location_risk["level"],
            "weight": self.risk_weights["location"],
            "description": location_risk["description"]
        })
        total_risk_score += location_risk["score"] * self.risk_weights["location"]

        # 2. Funding Goal Risk
        funding_risk = self._assess_funding_goal_risk(project_data["funding_goal"])
        risk_factors.append({
            "factor": "حجم التمويل",
            "impact": funding_risk["level"],
            "weight": self.risk_weights["funding_goal"],
            "description": funding_risk["description"]
        })
        total_risk_score += funding_risk["score"] * self.risk_weights["funding_goal"]

        # 3. Owner Experience Risk
        experience_risk = self._assess_experience_risk(project_data["owner_experience"])
        risk_factors.append({
            "factor": "خبرة صاحب المشروع",
            "impact": experience_risk["level"],
            "weight": self.risk_weights["owner_experience"],
            "description": experience_risk["description"]
        })
        total_risk_score += experience_risk["score"] * self.risk_weights["owner_experience"]

        # 4. Timeline Risk
        timeline_risk = self._assess_timeline_risk(project_data["timeline_months"])
        risk_factors.append({
            "factor": "المدة الزمنية",
            "impact": timeline_risk["level"],
            "weight": self.risk_weights["timeline"],
            "description": timeline_risk["description"]
        })
        total_risk_score += timeline_risk["score"] * self.risk_weights["timeline"]

        # 5. Category Risk
        category_risk = self._assess_category_risk(project_data["category"])
        risk_factors.append({
            "factor": "نوع المشروع",
            "impact": category_risk["level"],
            "weight": self.risk_weights["category"],
            "description": category_risk["description"]
        })
        total_risk_score += category_risk["score"] * self.risk_weights["category"]

        # Determine risk level
        risk_level = self._categorize_risk(total_risk_score)

        # Generate recommendations using AI
        recommendations = await self._generate_recommendations(
            risk_level,
            risk_factors,
            project_data
        )

        return {
            "risk_level": risk_level,
            "risk_score": round(total_risk_score, 2),
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "confidence": 0.85
        }

    def _assess_location_risk(self, location: str) -> Dict:
        """تقييم مخاطر الموقع"""
        high_risk_areas = ["إدلب", "دير الزور", "الرقة"]
        medium_risk_areas = ["حلب", "حمص", "درعا"]
        low_risk_areas = ["دمشق", "طرطوس", "اللاذقية"]

        if location in high_risk_areas:
            return {
                "score": 0.8,
                "level": "عالي",
                "description": "منطقة غير مستقرة أمنياً"
            }
        elif location in medium_risk_areas:
            return {
                "score": 0.5,
                "level": "متوسط",
                "description": "منطقة متوسطة الاستقرار"
            }
        else:
            return {
                "score": 0.2,
                "level": "منخفض",
                "description": "منطقة مستقرة نسبياً"
            }

    def _assess_funding_goal_risk(self, funding_goal: float) -> Dict:
        """تقييم مخاطر حجم التمويل"""
        if funding_goal > 100000:
            return {
                "score": 0.7,
                "level": "عالي",
                "description": "مبلغ كبير قد يصعب جمعه"
            }
        elif funding_goal > 50000:
            return {
                "score": 0.5,
                "level": "متوسط",
                "description": "مبلغ متوسط، قابل للتحقيق"
            }
        else:
            return {
                "score": 0.3,
                "level": "منخفض",
                "description": "مبلغ معقول وقابل للتحقيق"
            }

    def _assess_experience_risk(self, experience_years: int) -> Dict:
        """تقييم مخاطر نقص الخبرة"""
        if experience_years < 2:
            return {
                "score": 0.7,
                "level": "عالي",
                "description": "خبرة محدودة في المجال"
            }
        elif experience_years < 5:
            return {
                "score": 0.4,
                "level": "متوسط",
                "description": "خبرة متوسطة في المجال"
            }
        else:
            return {
                "score": 0.2,
                "level": "منخفض",
                "description": "خبرة جيدة في المجال"
            }

    def _assess_timeline_risk(self, months: int) -> Dict:
        """تقييم مخاطر المدة الزمنية"""
        if months > 24:
            return {
                "score": 0.6,
                "level": "عالي",
                "description": "مدة طويلة قد تزيد المخاطر"
            }
        elif months > 12:
            return {
                "score": 0.4,
                "level": "متوسط",
                "description": "مدة متوسطة ومعقولة"
            }
        else:
            return {
                "score": 0.2,
                "level": "منخفض",
                "description": "مدة قصيرة ومناسبة"
            }

    def _assess_category_risk(self, category: str) -> Dict:
        """تقييم مخاطر نوع المشروع"""
        low_risk_categories = ["BAKERY", "RETAIL", "AGRICULTURE"]
        medium_risk_categories = ["WORKSHOP", "SERVICE"]
        high_risk_categories = ["TECH", "MANUFACTURING"]

        if category in high_risk_categories:
            return {
                "score": 0.6,
                "level": "عالي",
                "description": "مجال يتطلب رأس مال كبير"
            }
        elif category in medium_risk_categories:
            return {
                "score": 0.4,
                "level": "متوسط",
                "description": "مجال تقليدي بمخاطر معتدلة"
            }
        else:
            return {
                "score": 0.3,
                "level": "منخفض",
                "description": "مجال مستقر ومجرب"
            }

    def _categorize_risk(self, score: float) -> str:
        """تصنيف مستوى المخاطرة"""
        if score < 0.35:
            return "LOW"
        elif score < 0.65:
            return "MEDIUM"
        else:
            return "HIGH"

    async def _generate_recommendations(
        self,
        risk_level: str,
        risk_factors: List[Dict],
        project_data: Dict
    ) -> List[str]:
        """توليد توصيات باستخدام AI"""
        prompt = f"""
بناءً على تقييم المخاطر التالي لمشروع:
- مستوى المخاطرة: {risk_level}
- عوامل الخطر: {risk_factors}
- الوصف: {project_data.get('description', '')}

قدم 3-5 توصيات عملية باللغة العربية لتقليل المخاطر وزيادة فرص النجاح.
"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )

            recommendations_text = response.content[0].text
            recommendations = [r.strip() for r in recommendations_text.split('\n') if r.strip() and not r.startswith('#')]

            return recommendations[:5]
        except:
            return [
                "تأكد من وجود خطة عمل واضحة ومفصلة",
                "احصل على استشارة من منتور في المجال",
                "ابدأ بميزانية محدودة واختبر السوق",
            ]

    async def assess_portfolio_risk(self, user_id: str) -> Dict:
        """تقييم مخاطر محفظة المستثمر"""
        # TODO: Fetch user's investments and calculate diversification
        return {
            "overall_risk": "MEDIUM",
            "diversification_score": 0.65,
            "recommendations": [
                "نوّع استثماراتك في مجالات مختلفة",
                "وزع المخاطر بين مشاريع عالية ومنخفضة المخاطرة",
            ]
        }

    async def get_market_analysis(self, category: str = None) -> Dict:
        """تحليل السوق"""
        return {
            "category": category,
            "total_projects": 45,
            "success_rate": 0.72,
            "average_roi": 18.5,
            "trend": "growing"
        }

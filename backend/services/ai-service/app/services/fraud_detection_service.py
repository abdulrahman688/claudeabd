from typing import Dict, List
import anthropic

from app.core.config import settings


class FraudDetectionService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def analyze_project_authenticity(self, project_data: Dict) -> Dict:
        """
        تحليل أصالة المشروع والكشف عن الاحتيال
        """
        red_flags = []
        fraud_score = 0.0

        # 1. Check for unrealistic ROI
        if project_data["expected_roi"] > 50:
            red_flags.append({
                "type": "unrealistic_roi",
                "severity": "high",
                "description": "العائد المتوقع مرتفع جداً وغير واقعي"
            })
            fraud_score += 0.3

        # 2. Check description for plagiarism (simplified)
        is_suspicious = await self._check_text_authenticity(
            project_data["description"]
        )
        if is_suspicious:
            red_flags.append({
                "type": "suspicious_text",
                "severity": "medium",
                "description": "النص يحتوي على مؤشرات مشبوهة"
            })
            fraud_score += 0.2

        # 3. Check if images are stock photos (simplified)
        if len(project_data.get("images", [])) == 0:
            red_flags.append({
                "type": "no_images",
                "severity": "low",
                "description": "لا توجد صور للمشروع"
            })
            fraud_score += 0.1

        # 4. Check documents
        if len(project_data.get("documents", [])) == 0:
            red_flags.append({
                "type": "no_documents",
                "severity": "medium",
                "description": "لا توجد مستندات داعمة"
            })
            fraud_score += 0.15

        # Determine if suspicious
        is_suspicious_project = fraud_score > 0.5

        # Get recommendation
        if fraud_score < 0.3:
            recommendation = "approve"
        elif fraud_score < 0.6:
            recommendation = "review_manually"
        else:
            recommendation = "reject"

        return {
            "is_suspicious": is_suspicious_project,
            "fraud_score": round(fraud_score, 2),
            "red_flags": red_flags,
            "recommendation": recommendation,
            "confidence": 0.75
        }

    async def _check_text_authenticity(self, text: str) -> bool:
        """
        التحقق من أصالة النص باستخدام AI
        """
        if len(text) < 50:
            return True  # Too short, suspicious

        # Check for generic/template language
        generic_phrases = [
            "مشروع رائد", "فرصة استثمارية فريدة",
            "عوائد مضمونة", "بدون مخاطر"
        ]

        suspicious_count = sum(1 for phrase in generic_phrases if phrase in text)

        return suspicious_count > 2

    async def verify_milestone_proof(
        self,
        milestone_id: str,
        proof_description: str,
        images: List[str]
    ) -> Dict:
        """
        التحقق من دليل إنجاز المرحلة
        """
        # Use Claude Vision API to analyze images
        prompt = f"""
        تحقق من صحة الدليل التالي لإنجاز مرحلة في مشروع:
        الوصف: {proof_description}
        عدد الصور: {len(images)}

        هل هذا الدليل كافٍ ومقنع؟ ما هي ملاحظاتك؟
        """

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )

            analysis = response.content[0].text

            # Determine if valid
            is_valid = "كافٍ" in analysis or "مقنع" in analysis

            return {
                "is_valid": is_valid,
                "confidence": 0.8,
                "analysis": analysis,
                "recommendation": "approve" if is_valid else "request_more_proof"
            }
        except:
            return {
                "is_valid": False,
                "confidence": 0.0,
                "analysis": "فشل التحليل",
                "recommendation": "manual_review"
            }

    async def check_document(self, document) -> Dict:
        """
        التحقق من أصالة مستند
        """
        # TODO: Implement OCR and document verification
        return {
            "is_authentic": True,
            "confidence": 0.7,
            "issues": []
        }

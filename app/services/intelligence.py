"""
Intelligence Service - The Soul of the AI Video Agent
Claude 3.5 Sonnet API integration for image analysis and script generation
"""

import json
import base64
import logging
from pathlib import Path
from typing import Dict, Optional
from anthropic import Anthropic, AsyncAnthropic
from app.core.config import settings

logger = logging.getLogger(__name__)


class IntelligenceService:
    """
    Service for analyzing product images and generating marketing scripts
    using Claude 3.5 Sonnet's vision capabilities.
    """

    def __init__(self):
        """Initialize the Claude client."""
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.CLAUDE_MODEL
        self.max_tokens = settings.CLAUDE_MAX_TOKENS

    def _get_system_prompt(self) -> str:
        """
        Get the system prompt for Claude.

        Returns:
            str: System prompt for marketing strategist persona
        """
        return """أنت خبير تسويق عالمي متخصص في مساعدة الأعمال الصغيرة.

مهمتك:
1. تحليل صورة المنتج بعمق
2. كتابة نص إعلاني قصير (15 ثانية) باللغة العربية العامية الدافئة والمؤثرة
3. استخراج اسم المنتج
4. تحديد الحالة المزاجية (vibe) المناسبة

النص يجب أن يكون:
- عاطفي ومؤثر
- محفز ويمنح القوة للتاجر الصغير
- مناسب لفيديو 15 ثانية
- باللغة العربية الدافئة (ليست فصحى جداً)

يجب أن يكون الرد بصيغة JSON فقط:
{
    "script": "النص الإعلاني بالعربية",
    "product_name": "اسم المنتج",
    "vibe": "الحالة المزاجية (مثال: energetic, warm, professional, emotional)"
}

تذكر: هدفك تمكين التاجر الصغير من المنافسة ضد الشركات الكبرى!"""

    async def _encode_image(self, image_path: Path) -> tuple[str, str]:
        """
        Encode image to base64 for Claude API.

        Args:
            image_path: Path to the image file

        Returns:
            Tuple of (base64_data, media_type)

        Raises:
            FileNotFoundError: If image doesn't exist
            ValueError: If image format is not supported
        """
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Determine media type
        suffix = image_path.suffix.lower()
        media_type_map = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp"
        }

        if suffix not in media_type_map:
            raise ValueError(f"Unsupported image format: {suffix}")

        media_type = media_type_map[suffix]

        # Read and encode image
        with open(image_path, "rb") as image_file:
            image_data = base64.standard_b64encode(image_file.read()).decode("utf-8")

        return image_data, media_type

    async def analyze_and_script(
        self,
        image_path: str | Path
    ) -> Dict[str, str]:
        """
        Analyze product image and generate marketing script.

        This is the core intelligence function that:
        1. Takes a product image
        2. Analyzes it using Claude's vision
        3. Generates an emotional, high-converting Arabic script
        4. Extracts product name and vibe

        Args:
            image_path: Path to the product image

        Returns:
            Dictionary with keys: script, product_name, vibe

        Raises:
            FileNotFoundError: If image doesn't exist
            ValueError: If response parsing fails
            Exception: For API errors
        """
        image_path = Path(image_path)
        logger.info(f"Analyzing image: {image_path.name}")

        try:
            # Encode image
            image_data, media_type = await self._encode_image(image_path)

            # Create message with vision
            message = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                system=self._get_system_prompt(),
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": media_type,
                                    "data": image_data,
                                },
                            },
                            {
                                "type": "text",
                                "text": "حلل هذه الصورة واكتب نص إعلاني مؤثر لها. أرجع الرد بصيغة JSON."
                            }
                        ],
                    }
                ],
            )

            # Extract response
            response_text = message.content[0].text
            logger.debug(f"Claude response: {response_text}")

            # Parse JSON response
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                # Try to extract JSON from markdown code blocks
                if "```json" in response_text:
                    json_start = response_text.find("```json") + 7
                    json_end = response_text.find("```", json_start)
                    json_text = response_text[json_start:json_end].strip()
                    result = json.loads(json_text)
                else:
                    raise ValueError("Failed to parse JSON response from Claude")

            # Validate response structure
            required_keys = ["script", "product_name", "vibe"]
            if not all(key in result for key in required_keys):
                raise ValueError(f"Response missing required keys: {required_keys}")

            logger.info(
                f"Analysis complete - Product: {result['product_name']}, "
                f"Vibe: {result['vibe']}"
            )

            return result

        except FileNotFoundError:
            logger.error(f"Image file not found: {image_path}")
            raise

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Claude response as JSON: {e}")
            raise ValueError(f"Invalid JSON response from AI: {e}")

        except Exception as e:
            logger.error(f"Error in Claude API call: {e}")
            raise Exception(f"Intelligence service error: {e}")


# Global service instance
_intelligence_service: Optional[IntelligenceService] = None


def get_intelligence_service() -> IntelligenceService:
    """Get or create intelligence service singleton."""
    global _intelligence_service
    if _intelligence_service is None:
        _intelligence_service = IntelligenceService()
    return _intelligence_service


async def analyze_and_script(image_path: str | Path) -> Dict[str, str]:
    """
    Convenience function for analyzing images and generating scripts.

    Args:
        image_path: Path to the product image

    Returns:
        Dictionary with script, product_name, and vibe
    """
    service = get_intelligence_service()
    return await service.analyze_and_script(image_path)

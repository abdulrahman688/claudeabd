"""
Voice Studio Service - The Quality Layer
ElevenLabs API integration for ultra-realistic Arabic voiceovers
"""

import logging
from pathlib import Path
from typing import Optional
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from app.core.config import settings

logger = logging.getLogger(__name__)


class VoiceStudioService:
    """
    Service for generating high-quality Arabic voiceovers
    using ElevenLabs' Multilingual v2 model.
    """

    def __init__(self):
        """Initialize ElevenLabs client."""
        self.client = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)
        self.voice_id = settings.ELEVENLABS_VOICE_ID
        self.model_id = settings.ELEVENLABS_MODEL_ID

    def _get_voice_settings(self, vibe: str) -> VoiceSettings:
        """
        Get voice settings based on the vibe/mood.

        Args:
            vibe: The emotional vibe (energetic, warm, professional, emotional)

        Returns:
            VoiceSettings optimized for the vibe
        """
        # Base settings for Arabic narration
        vibe_map = {
            "energetic": VoiceSettings(
                stability=0.5,
                similarity_boost=0.75,
                style=0.6,
                use_speaker_boost=True
            ),
            "warm": VoiceSettings(
                stability=0.7,
                similarity_boost=0.8,
                style=0.4,
                use_speaker_boost=True
            ),
            "professional": VoiceSettings(
                stability=0.8,
                similarity_boost=0.75,
                style=0.3,
                use_speaker_boost=True
            ),
            "emotional": VoiceSettings(
                stability=0.6,
                similarity_boost=0.85,
                style=0.7,
                use_speaker_boost=True
            ),
        }

        # Default to warm if vibe not recognized
        return vibe_map.get(
            vibe.lower(),
            VoiceSettings(
                stability=0.7,
                similarity_boost=0.8,
                style=0.5,
                use_speaker_boost=True
            )
        )

    async def generate_voice(
        self,
        text: str,
        vibe: str = "warm",
        output_path: Optional[Path] = None
    ) -> Path:
        """
        Generate professional Arabic voiceover from text.

        This function:
        1. Takes Arabic script text
        2. Selects optimal voice settings based on vibe
        3. Generates ultra-realistic voiceover using ElevenLabs
        4. Saves to MP3 file

        Args:
            text: The Arabic script text to convert to speech
            vibe: The emotional vibe (energetic, warm, professional, emotional)
            output_path: Optional custom output path. If None, auto-generates.

        Returns:
            Path to the generated audio file

        Raises:
            ValueError: If text is empty
            Exception: For API errors
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")

        logger.info(f"Generating voice with vibe: {vibe}")

        try:
            # Auto-generate output path if not provided
            if output_path is None:
                output_path = settings.TEMP_DIR / f"audio_{hash(text)}.mp3"

            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)

            # Get voice settings for the vibe
            voice_settings = self._get_voice_settings(vibe)

            logger.debug(
                f"Using voice ID: {self.voice_id}, "
                f"Model: {self.model_id}, "
                f"Settings: stability={voice_settings.stability}, "
                f"similarity_boost={voice_settings.similarity_boost}"
            )

            # Generate audio
            audio_generator = self.client.text_to_speech.convert(
                voice_id=self.voice_id,
                output_format="mp3_44100_128",
                text=text,
                model_id=self.model_id,
                voice_settings=voice_settings,
            )

            # Save audio to file
            with open(output_path, "wb") as audio_file:
                for chunk in audio_generator:
                    if chunk:
                        audio_file.write(chunk)

            logger.info(f"Voice generated successfully: {output_path.name}")
            return output_path

        except Exception as e:
            logger.error(f"Error generating voice: {e}")
            raise Exception(f"Voice studio error: {e}")

    def get_available_voices(self) -> list:
        """
        Get list of available voices from ElevenLabs.

        Returns:
            List of available voice objects

        Note:
            This is useful for configuration and testing.
        """
        try:
            voices = self.client.voices.get_all()
            return voices.voices
        except Exception as e:
            logger.error(f"Error fetching voices: {e}")
            return []


# Global service instance
_voice_studio_service: Optional[VoiceStudioService] = None


def get_voice_studio_service() -> VoiceStudioService:
    """Get or create voice studio service singleton."""
    global _voice_studio_service
    if _voice_studio_service is None:
        _voice_studio_service = VoiceStudioService()
    return _voice_studio_service


async def generate_voice(
    text: str,
    vibe: str = "warm",
    output_path: Optional[Path] = None
) -> Path:
    """
    Convenience function for generating voiceovers.

    Args:
        text: The Arabic script text
        vibe: The emotional vibe
        output_path: Optional output path

    Returns:
        Path to generated audio file
    """
    service = get_voice_studio_service()
    return await service.generate_voice(text, vibe, output_path)

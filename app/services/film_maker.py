"""
Film Maker Service - The Visual Magic
MoviePy integration for creating dynamic marketing videos with Ken Burns effect
"""

import logging
from pathlib import Path
from typing import Optional, Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy.editor import (
    ImageClip,
    AudioFileClip,
    CompositeVideoClip,
    TextClip,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class FilmMakerService:
    """
    Service for creating professional marketing videos with:
    - Ken Burns slow zoom effect
    - Audio overlay
    - Professional lower-third banner with product name
    - Vertical 9:16 format for social media
    """

    def __init__(self):
        """Initialize film maker with video settings."""
        self.width = settings.VIDEO_WIDTH
        self.height = settings.VIDEO_HEIGHT
        self.fps = settings.VIDEO_FPS
        self.duration = settings.VIDEO_DURATION
        self.zoom_factor = settings.ZOOM_FACTOR

    def _prepare_image(self, image_path: Path) -> Path:
        """
        Prepare image for video: resize and fit to 9:16 format.

        Args:
            image_path: Path to input image

        Returns:
            Path to prepared image
        """
        output_path = settings.TEMP_DIR / f"prepared_{image_path.name}"

        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Calculate dimensions to fit 9:16 format
            target_ratio = self.width / self.height
            img_ratio = img.width / img.height

            if img_ratio > target_ratio:
                # Image is wider, scale by height
                new_height = self.height
                new_width = int(new_height * img_ratio)
            else:
                # Image is taller, scale by width
                new_width = self.width
                new_height = int(new_width / img_ratio)

            # Resize image
            img_resized = img.resize((new_width, new_height), Image.LANCZOS)

            # Create canvas and center image
            canvas = Image.new("RGB", (self.width, self.height), (0, 0, 0))
            x_offset = (self.width - new_width) // 2
            y_offset = (self.height - new_height) // 2
            canvas.paste(img_resized, (x_offset, y_offset))

            # Save prepared image
            canvas.save(output_path, quality=95)

        logger.info(f"Image prepared: {output_path.name}")
        return output_path

    def _create_ken_burns_effect(
        self,
        image_path: Path,
        duration: float
    ) -> ImageClip:
        """
        Create Ken Burns slow zoom-in effect.

        Args:
            image_path: Path to prepared image
            duration: Video duration in seconds

        Returns:
            ImageClip with zoom effect applied
        """

        def zoom_effect(get_frame, t):
            """Apply progressive zoom to frame."""
            # Get original frame
            frame = get_frame(t)

            # Calculate zoom progress (0 to 1)
            progress = t / duration

            # Calculate current zoom level (1.0 to zoom_factor)
            current_zoom = 1.0 + (self.zoom_factor - 1.0) * progress

            # Get frame dimensions
            h, w = frame.shape[:2]

            # Calculate crop box for zoom
            crop_w = int(w / current_zoom)
            crop_h = int(h / current_zoom)

            # Center crop
            x1 = (w - crop_w) // 2
            y1 = (h - crop_h) // 2
            x2 = x1 + crop_w
            y2 = y1 + crop_h

            # Crop and resize
            cropped = frame[y1:y2, x1:x2]

            # Resize back to original dimensions
            from moviepy.video.fx.resize import resize
            resized = np.array(
                Image.fromarray(cropped).resize((w, h), Image.LANCZOS)
            )

            return resized

        # Create base clip
        clip = ImageClip(str(image_path), duration=duration)

        # Apply zoom effect
        clip = clip.fl(zoom_effect)

        return clip

    def _create_lower_third(
        self,
        product_name: str,
        duration: float
    ) -> ImageClip:
        """
        Create professional lower-third banner with product name.

        Args:
            product_name: Name of the product
            duration: Video duration

        Returns:
            ImageClip for the lower-third overlay
        """
        # Create banner image
        banner_height = 150
        banner = Image.new(
            "RGBA",
            (self.width, banner_height),
            (0, 0, 0, 180)  # Semi-transparent black
        )

        draw = ImageDraw.Draw(banner)

        # Try to use a nice font, fallback to default
        try:
            # Use a larger font size for Arabic text
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        except Exception:
            font = ImageFont.load_default()

        # Draw product name
        # Use textbbox to get text dimensions
        bbox = draw.textbbox((0, 0), product_name, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (self.width - text_width) // 2
        y = (banner_height - text_height) // 2

        # Draw text with shadow for depth
        draw.text((x + 3, y + 3), product_name, font=font, fill=(0, 0, 0, 255))
        draw.text((x, y), product_name, font=font, fill=(255, 255, 255, 255))

        # Save banner
        banner_path = settings.TEMP_DIR / "lower_third.png"
        banner.save(banner_path)

        # Create clip positioned at bottom
        banner_clip = (
            ImageClip(str(banner_path), duration=duration)
            .set_position(("center", self.height - banner_height - 50))
        )

        return banner_clip

    async def create_marketing_video(
        self,
        image_path: Path,
        audio_path: Path,
        product_name: str,
        output_path: Optional[Path] = None
    ) -> Path:
        """
        Create professional marketing video with all effects.

        This is the main function that combines:
        1. Ken Burns slow zoom effect
        2. Professional audio overlay
        3. Lower-third banner with product name
        4. Vertical 9:16 format

        Args:
            image_path: Path to product image
            audio_path: Path to voiceover audio
            product_name: Name of product for banner
            output_path: Optional custom output path

        Returns:
            Path to final video file

        Raises:
            FileNotFoundError: If image or audio missing
            Exception: For processing errors
        """
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        if not audio_path.exists():
            raise FileNotFoundError(f"Audio not found: {audio_path}")

        logger.info(f"Creating marketing video for: {product_name}")

        try:
            # Auto-generate output path
            if output_path is None:
                output_path = settings.TEMP_DIR / f"video_{product_name[:20]}_{hash(str(image_path))}.mp4"

            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)

            # Step 1: Prepare image
            prepared_image = self._prepare_image(image_path)

            # Step 2: Load audio and get actual duration
            audio_clip = AudioFileClip(str(audio_path))
            video_duration = min(audio_clip.duration, self.duration)

            logger.debug(f"Video duration: {video_duration}s")

            # Step 3: Create Ken Burns effect
            video_clip = self._create_ken_burns_effect(
                prepared_image,
                video_duration
            )

            # Step 4: Create lower-third banner
            lower_third = self._create_lower_third(
                product_name,
                video_duration
            )

            # Step 5: Composite video with banner
            final_video = CompositeVideoClip([video_clip, lower_third])

            # Step 6: Add audio
            final_video = final_video.set_audio(audio_clip)

            # Step 7: Export video
            logger.info("Rendering final video...")
            final_video.write_videofile(
                str(output_path),
                fps=self.fps,
                codec="libx264",
                audio_codec="aac",
                temp_audiofile=str(settings.TEMP_DIR / "temp_audio.m4a"),
                remove_temp=True,
                preset="medium",
                ffmpeg_params=["-profile:v", "high", "-level", "4.0"],
                logger=None,  # Suppress moviepy progress bars
            )

            # Clean up
            video_clip.close()
            audio_clip.close()
            final_video.close()

            logger.info(f"Video created successfully: {output_path.name}")
            return output_path

        except Exception as e:
            logger.error(f"Error creating video: {e}")
            raise Exception(f"Film maker error: {e}")


# Global service instance
_film_maker_service: Optional[FilmMakerService] = None


def get_film_maker_service() -> FilmMakerService:
    """Get or create film maker service singleton."""
    global _film_maker_service
    if _film_maker_service is None:
        _film_maker_service = FilmMakerService()
    return _film_maker_service


async def create_marketing_video(
    image_path: Path,
    audio_path: Path,
    product_name: str,
    output_path: Optional[Path] = None
) -> Path:
    """
    Convenience function for creating marketing videos.

    Args:
        image_path: Path to product image
        audio_path: Path to voiceover
        product_name: Product name
        output_path: Optional output path

    Returns:
        Path to final video
    """
    service = get_film_maker_service()
    return await service.create_marketing_video(
        image_path,
        audio_path,
        product_name,
        output_path
    )

"""
Telegram Bot Handlers
Professional handlers with status updates and error handling
"""

import logging
import time
from pathlib import Path
from datetime import datetime
from typing import Optional

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import async_session_maker
from app.models import User, VideoProject
from app.services import analyze_and_script, generate_voice, create_marketing_video

logger = logging.getLogger(__name__)


class VideoAgentBot:
    """Main Telegram bot class for AI Video Agent."""

    def __init__(self):
        """Initialize bot application."""
        self.app = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()

    async def start_command(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Handle /start command.

        Args:
            update: Telegram update
            context: Bot context
        """
        user = update.effective_user

        # Save user to database
        async with async_session_maker() as session:
            # Check if user exists
            stmt = select(User).where(User.telegram_id == user.id)
            result = await session.execute(stmt)
            db_user = result.scalar_one_or_none()

            if db_user is None:
                # Create new user
                db_user = User(
                    telegram_id=user.id,
                    username=user.username,
                    first_name=user.first_name,
                    last_name=user.last_name,
                )
                session.add(db_user)
                await session.commit()
                logger.info(f"New user registered: {user.id}")

        welcome_message = f"""🎬 مرحباً {user.first_name}!

أنا **وكيل الفيديو الذكي** - سلاحك السري للمنافسة! 🚀

🎯 **ماذا أفعل؟**
أحول صورة منتجك إلى فيديو إعلاني احترافي في ثوانٍ!

✨ **كيف أعمل؟**
1. 📸 أرسل لي صورة منتجك
2. 🧠 أحللها بذكاء اصطناعي
3. 🎙️ أسجل تعليق صوتي احترافي
4. 🎬 أصنع فيديو احترافي جاهز للنشر!

**جرب الآن!** أرسل صورة منتجك 👇"""

        await update.message.reply_text(welcome_message)

    async def help_command(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Handle /help command.

        Args:
            update: Telegram update
            context: Bot context
        """
        help_text = """📚 **دليل الاستخدام**

🎬 **كيف تستخدم الخدمة؟**

1️⃣ أرسل صورة لمنتجك (JPG, PNG)
2️⃣ انتظر التحليل والإنشاء
3️⃣ استلم فيديوك الاحترافي!

⚡ **نصائح للحصول على أفضل نتيجة:**
• استخدم صور واضحة وعالية الجودة
• تأكد أن المنتج واضح في الصورة
• الإضاءة الجيدة تصنع الفرق!

🆘 **مشاكل؟** راسل: @support"""

        await update.message.reply_text(help_text)

    async def stats_command(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Show user statistics.

        Args:
            update: Telegram update
            context: Bot context
        """
        user_id = update.effective_user.id

        async with async_session_maker() as session:
            stmt = select(User).where(User.telegram_id == user_id)
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()

            if user:
                stats_text = f"""📊 **إحصائياتك**

✅ عدد الفيديوهات المُنشأة: {user.videos_created}
📅 عضو منذ: {user.created_at.strftime('%Y-%m-%d')}
⚡ آخر نشاط: {user.last_active.strftime('%Y-%m-%d %H:%M')}

🚀 استمر في الإبداع!"""
            else:
                stats_text = "❌ لم نتمكن من العثور على بياناتك."

        await update.message.reply_text(stats_text)

    async def handle_photo(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Handle photo messages - Main workflow.

        Args:
            update: Telegram update
            context: Bot context
        """
        user_id = update.effective_user.id
        start_time = time.time()

        try:
            # Step 1: Download image
            await update.message.reply_text("📥 جاري تحميل الصورة...")

            photo_file = await update.message.photo[-1].get_file()
            image_path = settings.TEMP_DIR / f"img_{user_id}_{int(time.time())}.jpg"
            await photo_file.download_to_drive(image_path)

            logger.info(f"Image downloaded: {image_path.name}")

            # Create video project record
            async with async_session_maker() as session:
                project = VideoProject(
                    telegram_id=user_id,
                    user_id=user_id,
                    image_path=str(image_path),
                    status="processing"
                )
                session.add(project)
                await session.commit()
                project_id = project.id

            # Step 2: Analyze with Claude
            await update.message.reply_text("🚀 جاري تحليل منتجك بالذكاء الاصطناعي...")

            analysis = await analyze_and_script(image_path)
            product_name = analysis["product_name"]
            script = analysis["script"]
            vibe = analysis["vibe"]

            logger.info(f"Analysis complete: {product_name}")

            # Update project
            async with async_session_maker() as session:
                stmt = select(VideoProject).where(VideoProject.id == project_id)
                result = await session.execute(stmt)
                project = result.scalar_one()
                project.product_name = product_name
                project.script = script
                project.vibe = vibe
                await session.commit()

            # Step 3: Generate voice
            await update.message.reply_text("🎙️ جاري تسجيل التعليق الصوتي الاحترافي...")

            audio_path = await generate_voice(script, vibe)

            logger.info(f"Voice generated: {audio_path.name}")

            # Update project
            async with async_session_maker() as session:
                stmt = select(VideoProject).where(VideoProject.id == project_id)
                result = await session.execute(stmt)
                project = result.scalar_one()
                project.audio_path = str(audio_path)
                await session.commit()

            # Step 4: Create video
            await update.message.reply_text("🎬 جاري تجميع فيديوك الإعلاني...")

            video_path = await create_marketing_video(
                image_path,
                audio_path,
                product_name
            )

            logger.info(f"Video created: {video_path.name}")

            # Calculate processing time
            processing_time = time.time() - start_time

            # Update project
            async with async_session_maker() as session:
                # Update project
                stmt = select(VideoProject).where(VideoProject.id == project_id)
                result = await session.execute(stmt)
                project = result.scalar_one()
                project.video_path = str(video_path)
                project.status = "completed"
                project.completed_at = datetime.utcnow()
                project.processing_time_seconds = processing_time

                # Update user stats
                stmt = select(User).where(User.telegram_id == user_id)
                result = await session.execute(stmt)
                user = result.scalar_one()
                user.videos_created += 1
                user.last_active = datetime.utcnow()

                await session.commit()

            # Step 5: Send video
            await update.message.reply_text("✅ اكتمل! جاري الإرسال...")

            caption = f"""🔥 **سلاحك للفوز في السوق اليوم!**

📦 المنتج: {product_name}
⏱️ تم الإنشاء في: {processing_time:.1f} ثانية

🚀 انشر الآن على TikTok وInstagram Reels!

#تسويق_احترافي #فيديو_ذكي"""

            with open(video_path, "rb") as video_file:
                await update.message.reply_video(
                    video=video_file,
                    caption=caption,
                    supports_streaming=True
                )

            logger.info(f"Video sent successfully to user {user_id}")

        except FileNotFoundError as e:
            logger.error(f"File not found: {e}")
            await update.message.reply_text(
                "❌ حدث خطأ: لم نتمكن من العثور على الملف. حاول مرة أخرى."
            )
            await self._mark_project_failed(project_id, str(e))

        except Exception as e:
            logger.error(f"Error processing photo: {e}", exc_info=True)
            await update.message.reply_text(
                f"❌ حدث خطأ أثناء معالجة الصورة. الرجاء المحاولة مرة أخرى.\n\n"
                f"إذا استمرت المشكلة، راسل الدعم: @support"
            )
            await self._mark_project_failed(project_id, str(e))

    async def _mark_project_failed(
        self,
        project_id: int,
        error_message: str
    ) -> None:
        """Mark project as failed in database."""
        try:
            async with async_session_maker() as session:
                stmt = select(VideoProject).where(VideoProject.id == project_id)
                result = await session.execute(stmt)
                project = result.scalar_one_or_none()
                if project:
                    project.status = "failed"
                    project.error_message = error_message
                    await session.commit()
        except Exception as e:
            logger.error(f"Error marking project as failed: {e}")

    async def handle_document(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Handle document/file uploads.

        Args:
            update: Telegram update
            context: Bot context
        """
        await update.message.reply_text(
            "📸 الرجاء إرسال الصورة كـ **صورة** وليس كملف.\n\n"
            "اضغط على أيقونة المشبك 📎 واختر 'صورة' بدلاً من 'ملف'."
        )

    async def handle_text(
        self,
        update: Update,
        context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """
        Handle text messages.

        Args:
            update: Telegram update
            context: Bot context
        """
        await update.message.reply_text(
            "📸 أرسل صورة منتجك لأبدأ في صنع الفيديو!\n\n"
            "💡 نصيحة: استخدم صورة واضحة وعالية الجودة للحصول على أفضل نتيجة."
        )

    def setup(self) -> None:
        """Setup bot handlers."""
        # Command handlers
        self.app.add_handler(CommandHandler("start", self.start_command))
        self.app.add_handler(CommandHandler("help", self.help_command))
        self.app.add_handler(CommandHandler("stats", self.stats_command))

        # Message handlers
        self.app.add_handler(
            MessageHandler(filters.PHOTO, self.handle_photo)
        )
        self.app.add_handler(
            MessageHandler(filters.Document.ALL, self.handle_document)
        )
        self.app.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_text)
        )

        logger.info("Bot handlers configured")

    async def start(self) -> None:
        """Start the bot."""
        logger.info("Starting Telegram bot...")
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling(drop_pending_updates=True)
        logger.info("Bot is running!")

    async def stop(self) -> None:
        """Stop the bot."""
        logger.info("Stopping Telegram bot...")
        await self.app.updater.stop()
        await self.app.stop()
        await self.app.shutdown()
        logger.info("Bot stopped")


# Global bot instance
_bot: Optional[VideoAgentBot] = None


def setup_bot() -> VideoAgentBot:
    """Setup and return bot instance."""
    global _bot
    if _bot is None:
        _bot = VideoAgentBot()
        _bot.setup()
    return _bot


async def start_bot() -> VideoAgentBot:
    """Start bot and return instance."""
    bot = setup_bot()
    await bot.start()
    return bot

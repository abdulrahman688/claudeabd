# 🎬 Pro-Small-Business AI Video Agent

> **Empowering small local merchants with high-end marketing tools to compete against corporate giants.**

Transform product images into professional, AI-powered marketing videos in seconds — directly through Telegram!

## 🚀 Features

- **🧠 AI-Powered Analysis**: Claude 3.5 Sonnet analyzes your product and generates emotional, high-converting scripts in Arabic
- **🎙️ Professional Voiceovers**: ElevenLabs creates ultra-realistic, warm Arabic narration
- **🎥 Dynamic Videos**: MoviePy generates vertical (9:16) videos with Ken Burns zoom effect
- **📱 Telegram Integration**: Simple, accessible interface for non-technical users
- **⚡ Fast Processing**: Full video creation in under 30 seconds
- **📊 Analytics**: Track usage and video performance

## 🏗️ Architecture

```
Pro-Small-Business AI Video Agent
│
├── Frontend: Telegram Bot
│   └── User sends image → Receives professional video
│
├── Backend: FastAPI (Async)
│   ├── Intelligence Service (Claude 3.5 Sonnet)
│   ├── Voice Studio (ElevenLabs Multilingual v2)
│   └── Film Maker (MoviePy + Ken Burns Effect)
│
└── Database: SQLAlchemy + Async SQLite
    ├── User Management
    └── Video Project Tracking
```

## 📁 Project Structure

```
claudeabd/
├── app/
│   ├── core/
│   │   ├── config.py          # Centralized configuration
│   │   └── database.py        # Async SQLAlchemy setup
│   ├── services/
│   │   ├── intelligence.py    # Claude API integration
│   │   ├── voice_studio.py    # ElevenLabs integration
│   │   └── film_maker.py      # MoviePy video creation
│   ├── bot/
│   │   └── handlers.py        # Telegram bot handlers
│   ├── models/
│   │   └── user.py            # Database models
│   ├── static/
│   │   └── temp/              # Temporary file storage
│   └── main.py                # FastAPI application
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- FFmpeg (for video processing)
- Telegram Bot Token
- Anthropic API Key (Claude)
- ElevenLabs API Key

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/claudeabd.git
cd claudeabd
```

### 2. Install FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 3. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Required API Keys
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## 🔑 Getting API Keys

### 1. Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow instructions
3. Copy the token provided

### 2. Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up and navigate to API Keys
3. Create a new key

### 3. ElevenLabs API Key

1. Visit [elevenlabs.io](https://elevenlabs.io)
2. Sign up and go to Profile → API Keys
3. Create a new key

**Voice Selection:**
- Default: `pNInz6obpgDQGcFmaJgB` (Adam - warm, trustworthy)
- Browse more at: [elevenlabs.io/voice-library](https://elevenlabs.io/voice-library)

## 🚀 Usage

### Start the Application

```bash
python app/main.py
```

Or with uvicorn directly:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Using the Telegram Bot

1. Find your bot on Telegram
2. Send `/start` to begin
3. Send a product image
4. Wait 15-30 seconds
5. Receive your professional marketing video!

### Bot Commands

- `/start` - Welcome message and instructions
- `/help` - Usage guide
- `/stats` - View your video creation statistics

## 📊 API Endpoints

The FastAPI backend provides these endpoints:

- `GET /` - Health check and welcome
- `GET /health` - Application health status
- `GET /stats` - Global usage statistics

Access at: `http://localhost:8000/docs` for interactive API documentation

## 🎨 Video Customization

### Video Settings (in `.env`)

```env
VIDEO_WIDTH=1080          # Video width (9:16 format)
VIDEO_HEIGHT=1920         # Video height
VIDEO_FPS=30              # Frames per second
VIDEO_DURATION=15         # Maximum duration in seconds
ZOOM_FACTOR=1.15          # Ken Burns zoom (1.0-1.3)
```

### Voice Settings

Customize voice characteristics in `app/core/config.py`:

```python
ELEVENLABS_VOICE_ID=your_preferred_voice_id
```

## 🗄️ Database

The application uses async SQLite for MVP deployment. Data is stored in `ai_video_agent.db`.

### Models

- **User**: Telegram user information and statistics
- **VideoProject**: Tracking for each video creation

### Database Migration

For production, migrate to PostgreSQL by updating `DATABASE_URL`:

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname
```

## 🔒 Error Handling

The application includes comprehensive error handling:

- API failures → User-friendly error messages
- File processing errors → Automatic retry logic
- Database errors → Transaction rollbacks
- Logging → `ai_video_agent.log` file

## 📈 Monitoring

View logs in real-time:

```bash
tail -f ai_video_agent.log
```

Check statistics:

```bash
curl http://localhost:8000/stats
```

## 🚀 Production Deployment

### Using Docker (Recommended)

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app/main.py"]
```

Build and run:

```bash
docker build -t ai-video-agent .
docker run -p 8000:8000 --env-file .env ai-video-agent
```

### Using Systemd

Create `/etc/systemd/system/ai-video-agent.service`:

```ini
[Unit]
Description=AI Video Agent
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/ai-video-agent
Environment="PATH=/opt/ai-video-agent/venv/bin"
ExecStart=/opt/ai-video-agent/venv/bin/python app/main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable ai-video-agent
sudo systemctl start ai-video-agent
```

## 🧪 Testing

Test individual services:

```python
# Test Intelligence Service
python -c "
import asyncio
from app.services import analyze_and_script
result = asyncio.run(analyze_and_script('path/to/image.jpg'))
print(result)
"

# Test Voice Studio
python -c "
import asyncio
from app.services import generate_voice
audio = asyncio.run(generate_voice('مرحبا بك', 'warm'))
print(f'Audio saved to: {audio}')
"
```

## 🐛 Troubleshooting

### FFmpeg Not Found

```bash
# Verify installation
ffmpeg -version

# Add to PATH if needed
export PATH="/usr/local/bin:$PATH"
```

### Database Locked Error

```bash
# Remove database and restart
rm ai_video_agent.db
python app/main.py
```

### API Rate Limits

- **Claude**: 50 requests/minute (tier 1)
- **ElevenLabs**: 10,000 characters/month (free tier)

## 📚 Documentation

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Anthropic Claude API](https://docs.anthropic.com)
- [ElevenLabs API](https://elevenlabs.io/docs)
- [MoviePy Guide](https://zulko.github.io/moviepy)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your projects!

## 💡 Use Cases

- **Local Shops**: Create product showcase videos
- **Restaurants**: Generate menu item promotions
- **Craftsmen**: Showcase handmade products
- **Service Providers**: Visual service demonstrations
- **Market Vendors**: Quick promotional content

## 🎯 Roadmap

- [ ] Multi-language support (English, French)
- [ ] Custom branding (logos, colors)
- [ ] Background music library
- [ ] Video templates
- [ ] Batch processing
- [ ] WhatsApp integration
- [ ] Analytics dashboard

## 👥 Support

- **Issues**: GitHub Issues
- **Email**: support@example.com
- **Telegram**: @support

---

**Built with ❤️ to empower small businesses worldwide**

🚀 **Start creating professional videos today!**

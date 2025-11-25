#!/bin/bash

# Pro-Small-Business AI Video Agent - Quick Start Script

echo "🎬 Pro-Small-Business AI Video Agent"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please create .env file from .env.example:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and add your API keys:"
    echo "  - TELEGRAM_BOT_TOKEN"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - ELEVENLABS_API_KEY"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/installed
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  Warning: FFmpeg not found!"
    echo "Please install FFmpeg:"
    echo "  Ubuntu/Debian: sudo apt install ffmpeg"
    echo "  macOS: brew install ffmpeg"
    echo ""
fi

echo ""
echo "🚀 Starting AI Video Agent..."
echo ""

# Run the application
python app/main.py

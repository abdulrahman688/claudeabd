from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json

from app.services.sham_chatbot_service import ShamChatbotService
from app.core.websocket_manager import manager


router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    user_id: str
    user_context: Optional[dict] = None


class ChatResponse(BaseModel):
    message: str
    sentiment: Optional[str] = None
    suggested_resources: Optional[List[dict]] = None


@router.post("/message", response_model=ChatResponse)
async def chat_message(data: ChatMessage):
    """
    إرسال رسالة لشام AI والحصول على رد
    """
    service = ShamChatbotService()

    try:
        response = await service.chat(
            user_message=data.message,
            user_id=data.user_id,
            user_context=data.user_context or {}
        )

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket للمحادثة في الوقت الفعلي مع شام AI
    """
    await manager.connect(websocket)

    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message_data = json.loads(data)

            service = ShamChatbotService()

            # Process message
            response = await service.chat(
                user_message=message_data["message"],
                user_id=message_data.get("user_id", "anonymous"),
                user_context=message_data.get("user_context", {})
            )

            # Send response
            await manager.send_personal_message(
                json.dumps(response, ensure_ascii=False),
                websocket
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        manager.disconnect(websocket)


@router.post("/voice")
async def voice_input(audio_file: bytes):
    """
    معالجة إدخال صوتي (عربي) وتحويله لنص
    """
    # TODO: Implement speech-to-text for Arabic
    return {"text": "الميزة قيد التطوير"}


@router.get("/conversation-history/{user_id}")
async def get_conversation_history(user_id: str, limit: int = 50):
    """
    الحصول على سجل المحادثات
    """
    service = ShamChatbotService()
    history = await service.get_conversation_history(user_id, limit)
    return {"history": history}

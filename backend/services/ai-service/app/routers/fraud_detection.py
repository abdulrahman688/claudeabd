from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List

from app.services.fraud_detection_service import FraudDetectionService


router = APIRouter()


class ProjectAuthenticityRequest(BaseModel):
    project_id: str
    description: str
    images: List[str]  # IPFS hashes
    documents: List[str]  # IPFS hashes
    expected_roi: float


@router.post("/analyze-project")
async def analyze_project_authenticity(data: ProjectAuthenticityRequest):
    """
    تحليل أصالة المشروع والكشف عن الاحتيال المحتمل
    """
    service = FraudDetectionService()

    try:
        analysis = await service.analyze_project_authenticity(data.dict())
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify-milestone")
async def verify_milestone_proof(
    milestone_id: str,
    proof_description: str,
    images: List[str]
):
    """
    التحقق من دليل إنجاز مرحلة معينة
    """
    service = FraudDetectionService()

    try:
        verification = await service.verify_milestone_proof(
            milestone_id,
            proof_description,
            images
        )
        return verification
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/check-document")
async def check_document_authenticity(document: UploadFile = File(...)):
    """
    التحقق من أصالة وثيقة
    """
    service = FraudDetectionService()

    try:
        result = await service.check_document(document)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

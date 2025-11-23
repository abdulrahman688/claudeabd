from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.services.risk_assessment_service import RiskAssessmentService


router = APIRouter()


class ProjectRiskRequest(BaseModel):
    project_id: str
    category: str
    location: str
    funding_goal: float
    owner_experience: int  # years
    timeline_months: int
    description: str


class RiskAssessmentResponse(BaseModel):
    risk_level: str  # LOW, MEDIUM, HIGH
    risk_score: float  # 0-1
    risk_factors: List[Dict]
    recommendations: List[str]
    confidence: float


@router.post("/assess-project", response_model=RiskAssessmentResponse)
async def assess_project_risk(data: ProjectRiskRequest):
    """
    تقييم مستوى المخاطرة لمشروع معين
    """
    service = RiskAssessmentService()

    try:
        assessment = await service.assess_project_risk(data.dict())
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/assess-portfolio")
async def assess_portfolio_risk(user_id: str):
    """
    تقييم مستوى المخاطرة لمحفظة مستثمر
    """
    service = RiskAssessmentService()

    try:
        assessment = await service.assess_portfolio_risk(user_id)
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-analysis")
async def get_market_analysis(category: Optional[str] = None):
    """
    تحليل السوق للمشاريع في فئة معينة
    """
    service = RiskAssessmentService()

    try:
        analysis = await service.get_market_analysis(category)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

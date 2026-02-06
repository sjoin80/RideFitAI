from typing import List, Tuple
from fastapi import FastAPI
from pydantic import BaseModel, Field
from services.fit_model import estimate_fit
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI Bike Fit Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FitRequest(BaseModel):
    height_in: float = Field(..., gt=0, examples=[74])
    inseam_in: float = Field(..., gt=0, examples=[35])
    riding_style: str = Field(..., examples=["endurance"])
    flexibility: str = Field(..., examples=["medium"])


class FitResponse(BaseModel):
    saddle_height_in: float
    saddle_height_cm: float
    saddle_height_range_in: Tuple[float, float]
    saddle_height_range_cm: Tuple[float, float]
    reach_guidance: str
    bar_drop_guidance: str
    geometry_guidance: str
    confidence: float
    notes: List[str]
    next_adjustment: str
    disclaimer: str


@app.get("/")
def root():
    return {"message": "AI Bike Fit Advisor is running"}


@app.post("/fit", response_model=FitResponse)
def fit(data: FitRequest):
    return estimate_fit(
        height_in=data.height_in,
        inseam_in=data.inseam_in,
        riding_style=data.riding_style,
        flexibility=data.flexibility,
    )

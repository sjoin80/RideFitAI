from typing import List, Tuple, Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field
from backend.services.fit_model import estimate_fit

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI Bike Fit Advisor API")

# CORS: allows the React frontend (localhost:5173) to call this API (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pain point "vocabulary" we will accept from the UI / voice parser.
# Keeping this list controlled prevents random strings and helps consistency.
ALLOWED_PAIN_POINTS = {
    "knee_front",
    "knee_back",
    "hand_numbness",
    "neck_pain",
    "lower_back_pain",
    "hip_pain",
}

# Simple rule set: deterministic and safe. We are not diagnosing, we are guiding fit adjustments.
PAIN_RULES = {
    "knee_front": {
        "label": "Front of knee pain",
        "likely_causes": [
            "Saddle may be too low",
            "Saddle may be too far forward",
            "Gears too hard / low cadence can contribute",
        ],
        "first_adjustment": "Raise saddle 3–5mm OR move saddle back slightly (try one change at a time).",
        "caution": "Too much saddle height can cause hip rocking and hamstring strain.",
    },
    "knee_back": {
        "label": "Back of knee pain",
        "likely_causes": [
            "Saddle may be too high",
            "Saddle may be too far back",
        ],
        "first_adjustment": "Lower saddle 3–5mm OR move saddle forward slightly (one change at a time).",
        "caution": "Lowering too much can shift stress to the front of the knee.",
    },
    "hand_numbness": {
        "label": "Hand numbness",
        "likely_causes": [
            "Too much weight on hands",
            "Reach may be too long",
            "Bars may be too low",
        ],
        "first_adjustment": "Shorten reach (stem/spacers) or raise bars slightly. Check hood angle and bar tape too.",
        "caution": "Too upright can reduce front-end traction and affect handling.",
    },
    "neck_pain": {
        "label": "Neck pain",
        "likely_causes": [
            "Bars may be too low",
            "Reach may be too long",
            "Looking up strain during long rides",
        ],
        "first_adjustment": "Raise bars slightly or shorten reach. Confirm you are not overreaching to the hoods.",
        "caution": "Large changes can affect handling. Adjust gradually.",
    },
    "lower_back_pain": {
        "label": "Lower back pain",
        "likely_causes": [
            "Reach may be too long",
            "Bars too low for current flexibility",
            "Core fatigue on longer rides",
        ],
        "first_adjustment": "Reduce reach or raise bars slightly. Consider shorter rides while adapting.",
        "caution": "If pain is sharp or persistent, consider a professional fit.",
    },
    "hip_pain": {
        "label": "Hip pain",
        "likely_causes": [
            "Saddle height may be too high causing rocking",
            "Saddle may not match anatomy",
        ],
        "first_adjustment": "Check for hip rocking; try lowering saddle 2–3mm and confirm saddle comfort/support.",
        "caution": "Hip issues can be complex; change one variable at a time.",
    },
}


class FitRequest(BaseModel):
    height_in: float = Field(..., gt=0, examples=[74])
    inseam_in: float = Field(..., gt=0, examples=[35])
    riding_style: str = Field(..., examples=["endurance"])
    flexibility: str = Field(..., examples=["medium"])

    # NEW: pain points list. Defaults to empty list if user has none.
    # This is what your UI checkboxes and voice input will populate.
    pain_points: List[str] = Field(default_factory=list, examples=[["hand_numbness", "knee_front"]])


class PainInsight(BaseModel):
    pain_point: str
    label: str
    likely_causes: List[str]
    first_adjustment: str
    caution: str


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

    # NEW: pain analysis returned as structured items
    pain_analysis: List[PainInsight] = []
    # NEW: one suggested priority action string, optional if no pain points
    priority_adjustment: Optional[str] = None


@app.get("/")
def root():
    return {"message": "AI Bike Fit Advisor is running"}


@app.post("/fit", response_model=FitResponse)
def fit(data: FitRequest):
    # Base fit estimate stays exactly the same
    result = estimate_fit(
        height_in=data.height_in,
        inseam_in=data.inseam_in,
        riding_style=data.riding_style,
        flexibility=data.flexibility,
    )

    # NEW: Filter pain points to a known set (prevents unexpected strings)
    cleaned = [p.strip().lower() for p in (data.pain_points or [])]
    valid_pains = [p for p in cleaned if p in ALLOWED_PAIN_POINTS]

    pain_analysis: List[dict] = []
    for p in valid_pains:
        rule = PAIN_RULES.get(p)
        if rule:
            pain_analysis.append(
                {
                    "pain_point": p,
                    "label": rule["label"],
                    "likely_causes": rule["likely_causes"],
                    "first_adjustment": rule["first_adjustment"],
                    "caution": rule["caution"],
                }
            )

    # NEW: Priority adjustment picks the first pain point's first adjustment (simple MVP logic)
    priority_adjustment = None
    if pain_analysis:
        priority_adjustment = pain_analysis[0]["first_adjustment"]

        # Also add a note so the user sees this even if they miss the section
        result.setdefault("notes", [])
        result["notes"].append("Pain guidance added. Make one change at a time and retest on a short ride.")

        # Slightly reduce confidence if pain points exist (signals additional complexity)
        if "confidence" in result:
            result["confidence"] = round(max(0.35, result["confidence"] - 0.05), 2)

    # Merge new fields into the existing result payload
    result["pain_analysis"] = pain_analysis
    result["priority_adjustment"] = priority_adjustment

    return result

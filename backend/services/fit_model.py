def estimate_fit(height_in: float, inseam_in: float, riding_style: str, flexibility: str) -> dict:
    """
    AI Bike Fit Advisor - starter fit estimator.
    Produces ranges and actionable guidance.
    """

    style = (riding_style or "").strip().lower()
    flex = (flexibility or "").strip().lower()

    # Baseline saddle height using inseam heuristic (BB center to saddle top)
    inseam_cm = inseam_in * 2.54
    saddle_height_cm = inseam_cm * 0.883
    saddle_height_in = saddle_height_cm / 2.54

    # Small style tweaks
    style_adjust_in = {"endurance": 0.0, "race": 0.2, "gravel": -0.1, "commute": -0.2}.get(style, 0.0)
    saddle_height_in += style_adjust_in
    saddle_height_cm = saddle_height_in * 2.54

    # Recommend a range (most fits end up +/- a bit)
    saddle_range_in = (round(saddle_height_in - 0.35, 2), round(saddle_height_in + 0.35, 2))
    saddle_range_cm = (round(saddle_height_cm - 0.9, 1), round(saddle_height_cm + 0.9, 1))

    # Rough reach tendency based on style
    reach_text = {
        "race": "Longer reach common. Start neutral, then lengthen only if stable and pain-free.",
        "endurance": "Balanced reach. Prioritize comfort and breathing.",
        "gravel": "Slightly shorter reach for control and confidence on rough terrain.",
        "commute": "Upright and relaxed. Visibility and comfort first."
    }.get(style, "Start neutral and adjust slowly.")

    # Flexibility affects bar drop tolerance
    drop_text = {
        "low": "Lower flexibility: aim for less bar drop (higher bars) and shorter reach.",
        "medium": "Medium flexibility: moderate bar drop usually works well.",
        "high": "High flexibility: you can often tolerate more bar drop if you want a racier posture."
    }.get(flex, "Flexibility guidance: prioritize comfort, then adjust gradually.")

    # Simple “stack/reach direction” suggestion
    if flex == "low" or style in ["commute", "gravel"]:
        geo = "Consider higher stack and slightly shorter reach (comfort and control)."
    elif style == "race" and flex == "high":
        geo = "Consider lower stack and slightly longer reach (aggressive posture)."
    else:
        geo = "Consider a balanced stack and reach (endurance-friendly)."

    # Confidence score (starter logic)
    confidence = 0.78
    notes = []

    # Basic plausibility checks
    if inseam_in < 24 or inseam_in > 42:
        confidence -= 0.15
        notes.append("Inseam value looks unusual. Re-measure inseam for best results.")

    if height_in < 54 or height_in > 84:
        confidence -= 0.15
        notes.append("Height value looks unusual. Confirm height in inches.")

    if style not in ["endurance", "race", "gravel", "commute"]:
        confidence -= 0.10
        notes.append("Riding style not recognized. Use endurance, race, gravel, or commute.")

    if flex not in ["low", "medium", "high"]:
        confidence -= 0.10
        notes.append("Flexibility not recognized. Use low, medium, or high.")

    confidence = max(0.35, min(0.95, confidence))

    # First adjustment recommendation
    next_step = "Set saddle height to the midpoint of the range, then adjust in 2-3mm steps after short rides."
    if flex == "low":
        next_step = "Start at the lower end of the saddle range and reduce reach before lowering the bars."

    return {
        "saddle_height_in": round(saddle_height_in, 2),
        "saddle_height_cm": round(saddle_height_cm, 1),
        "saddle_height_range_in": saddle_range_in,
        "saddle_height_range_cm": saddle_range_cm,
        "reach_guidance": reach_text,
        "bar_drop_guidance": drop_text,
        "geometry_guidance": geo,
        "confidence": round(confidence, 2),
        "notes": notes,
        "next_adjustment": next_step,
        "disclaimer": "Starting estimate only. If you have pain, numbness, or injuries, consult a professional fitter."
    }

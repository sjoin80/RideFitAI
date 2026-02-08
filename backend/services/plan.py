from typing import Dict, List, Any


def _mm_to_in(mm: float) -> float:
    return round(mm / 25.4, 3)


def build_fit_plan(fit_result: Dict[str, Any], pain_points: List[str]) -> Dict[str, Any]:
    """
    Build a structured, rule-based coaching plan from the base fit result and pain points.
    This stays deterministic, fast, and safe (no diagnosis).
    """
    pain_points = [p.strip().lower() for p in (pain_points or []) if p and p.strip()]
    confidence = float(fit_result.get("confidence", 0.7))

    saddle_in = float(fit_result.get("saddle_height_in", 0.0))
    saddle_range_in = fit_result.get("saddle_height_range_in", (None, None))

    warnings: List[str] = []
    what_to_track: List[str] = [
        "Hand pressure or numbness",
        "Knee pain location (front vs back)",
        "Lower back tightness",
        "Neck strain",
        "Cadence comfort (spinning vs grinding)",
        "Any hip rocking at the top of the stroke",
    ]

    follow_up_questions: List[str] = [
        "How long into the ride do symptoms start (minutes)?",
        "Do symptoms improve when you ride in the drops or on the tops?",
        "Are you riding clipless or flat pedals?",
        "What is your typical cadence range on steady efforts?",
        "Do you feel your hips rock side to side when pedaling?",
    ]

    # Safety guardrails
    warnings.append("Change one thing at a time, then retest on a short ride (10 to 20 minutes).")
    warnings.append("Avoid large adjustments. Start with 2 to 3 mm changes (about 0.08 to 0.12 inches).")
    if confidence < 0.55:
        warnings.append("Low confidence due to unusual inputs. Re-check your height and inseam measurements.")

    # Pain-driven priorities (simple and effective)
    priority = None
    if "knee_front" in pain_points:
        priority = "knee_front"
    elif "knee_back" in pain_points:
        priority = "knee_back"
    elif "hand_numbness" in pain_points:
        priority = "hand_numbness"
    elif "lower_back_pain" in pain_points:
        priority = "lower_back_pain"
    elif "neck_pain" in pain_points:
        priority = "neck_pain"
    elif "hip_pain" in pain_points:
        priority = "hip_pain"

    # Build a 3-step plan
    steps: List[Dict[str, Any]] = []

    # Step 1: Saddle height micro-adjust
    # Default direction uses pain as signal
    if priority == "knee_front":
        direction = "raise slightly OR move saddle back slightly (pick ONE)."
        delta_mm = 3
        why = "Front knee pain often improves with slightly more extension or less forward knee tracking."
        if_worse = "Undo the change and try the opposite direction (lower 2 to 3 mm or move saddle forward slightly)."
    elif priority == "knee_back" or priority == "hip_pain":
        direction = "lower slightly."
        delta_mm = 3
        why = "Back of knee pain or hip rocking can happen when saddle height is too high."
        if_worse = "Undo the change and return to your prior height. Then try a 2 mm change instead."
    else:
        direction = "set saddle height near the midpoint of the recommended range."
        delta_mm = 0
        why = "Most riders land near the middle, then fine-tune in tiny steps."
        if_worse = "If discomfort increases, return to baseline and verify inseam measurement."

    steps.append(
        {
            "step": 1,
            "title": "Saddle height",
            "action": (
                f"Start at {saddle_in:.2f} in. "
                + (f"Then {direction} Change by {delta_mm} mm (~{_mm_to_in(delta_mm)} in)." if delta_mm else f"Target range: {saddle_range_in}.")
            ),
            "why": why,
            "test_ride": "Ride 10 to 15 minutes on flat terrain at an easy pace. Keep cadence comfortable.",
            "success_signals": [
                "Less pain or numbness",
                "Smoother pedal stroke",
                "No hip rocking",
            ],
            "if_worse": if_worse,
        }
    )

    # Step 2: Reach / bar height based on upper-body pain
    if "hand_numbness" in pain_points or "neck_pain" in pain_points or "lower_back_pain" in pain_points:
        steps.append(
            {
                "step": 2,
                "title": "Reach and bar height",
                "action": "Reduce reach slightly or raise bars slightly (spacers or stem). Start small.",
                "why": "Numb hands and neck or back strain often come from too much weight on the hands or too long a reach.",
                "test_ride": "Ride 10 minutes and focus on relaxed shoulders and light hands on the hoods.",
                "success_signals": [
                    "Less pressure on hands",
                    "Neck feels relaxed",
                    "Lower back feels less tight",
                ],
                "if_worse": "Return to baseline and make a smaller change. Verify saddle setback before changing cockpit again.",
            }
        )
    else:
        steps.append(
            {
                "step": 2,
                "title": "Reach check",
                "action": "Keep reach neutral for now. Focus on one adjustment per ride.",
                "why": "If you change saddle and cockpit at the same time, it becomes hard to learn what fixed the issue.",
                "test_ride": "Repeat the same 10 to 15 minute test route after Step 1.",
                "success_signals": ["Consistent comfort on repeated test rides"],
                "if_worse": "Return to baseline and verify measurements, then re-run the estimate.",
            }
        )

    # Step 3: Pedaling and gearing habit
    steps.append(
        {
            "step": 3,
            "title": "Cadence and load",
            "action": "Aim for a smoother, higher cadence during the test (avoid grinding big gears).",
            "why": "Grinding low cadence can amplify knee stress and make fit issues feel worse.",
            "test_ride": "On a steady section, shift easier and spin for 3 to 5 minutes.",
            "success_signals": ["Knees feel less loaded", "More comfortable breathing"],
            "if_worse": "Return to your normal cadence and focus on fit changes first.",
        }
    )

    # Make plan more cautious if low confidence
    if confidence < 0.6:
        warnings.append("Because confidence is lower, keep changes to 2 mm increments and retest twice before changing anything else.")

    return {
        "adjustment_plan": steps,
        "what_to_track": what_to_track,
        "follow_up_questions": follow_up_questions,
        "warnings": warnings,
    }

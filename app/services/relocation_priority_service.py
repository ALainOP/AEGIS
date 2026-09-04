def calculate_priority_score(
    hazard_risk: float,
    vulnerability_score: float,
    disaster_history_score: float
):
    """
    Calculate the final relocation priority score.

    Weights:
    Hazard Risk          = 40%
    Vulnerability Score  = 40%
    Disaster History     = 20%
    """

    priority_score = (
        hazard_risk * 0.40
        + vulnerability_score * 0.40
        + disaster_history_score * 0.20
    )

    priority_score = round(priority_score, 2)

    # Determine priority level and relocation phase
    if priority_score >= 80:
        priority_level = "HIGH"
        relocation_phase = "Immediate"

    elif priority_score >= 60:
        priority_level = "MEDIUM"
        relocation_phase = "Short-term"

    else:
        priority_level = "LOW"
        relocation_phase = "Medium-term"

    return {
        "priority_score": priority_score,
        "priority_level": priority_level,
        "relocation_phase": relocation_phase
    }
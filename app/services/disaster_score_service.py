def calculate_disaster_history_score(
    severity: float,
    casualties: int,
    property_loss: float
):
    casualty_score = min(casualties * 2, 100)

    loss_score = min(property_loss / 1000000, 100)

    score = (
        severity * 0.60
        + casualty_score * 0.20
        + loss_score * 0.20
    )

    return round(min(score, 100), 2)
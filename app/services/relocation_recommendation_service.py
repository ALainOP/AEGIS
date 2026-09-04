def calculate_recommendation_score(
    suitability_score: float,
    capacity_score: float,
    distance_score: float
):
    score = (
        suitability_score * 0.40
        + capacity_score * 0.30
        + distance_score * 0.30
    )

    return round(score, 2)


def get_recommendation_level(score: float):

    if score >= 80:
        return "HIGHLY RECOMMENDED"

    elif score >= 60:
        return "RECOMMENDED"

    else:
        return "LOW PRIORITY"

function generateRecommendations(analysisResult) {
    const recommendations = [];

    if (analysisResult.skinType === "Oily") {
        recommendations.push({
            category: "skincare",
            routine: "Morning",
            recommendation:
                "Use a gentle cleanser and a lightweight, non-comedogenic moisturizer."
        });
    }

    if (analysisResult.skinType === "Dry") {
        recommendations.push({
            category: "skincare",
            routine: "Morning",
            recommendation:
                "Use a gentle cleanser and a moisturizing cream."
        });
    }

    if (analysisResult.acneDetected) {
        recommendations.push({
            category: "acne",
            routine: "Morning",
            recommendation:
                "Consider non-comedogenic skincare products and avoid harsh scrubbing."
        });
    }

    recommendations.push({
        category: "sunProtection",
        routine: "Morning",
        recommendation:
            "Use broad-spectrum sunscreen with SPF 30 or higher."
    });

    recommendations.push({
        category: "skincare",
        routine: "Night",
        recommendation:
            "Cleanse gently and apply a moisturizer suitable for your skin type."
    });

    return recommendations;
}

module.exports = {
    generateRecommendations
};
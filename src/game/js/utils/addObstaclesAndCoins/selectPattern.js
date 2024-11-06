export function selectPattern(patternWeights) {
    const tempPatterns = patternWeights.filter(p =>
        p.pattern.obstacles.length > 0 ||
        p.pattern.jumpObstacles.length > 0 ||
        p.pattern.slideObstacles.length > 0
    );

    const totalWeight = tempPatterns.reduce((sum, p) => sum + p.weight, 0);

    let random = Math.random() * totalWeight;
    for (const pattern of tempPatterns) {
        if (random < pattern.weight) {
            return pattern.pattern;
        }
        random -= pattern.weight;
    }

    return tempPatterns[Math.floor(Math.random() * tempPatterns.length)].pattern;
}

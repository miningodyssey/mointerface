export function ensureManeuverability(selectedPattern) {
    const occupiedLanes = new Set();

    selectedPattern.obstacles.forEach(lane => occupiedLanes.add(lane));
    selectedPattern.jumpObstacles.forEach(lane => occupiedLanes.add(lane));
    selectedPattern.slideObstacles.forEach(lane => occupiedLanes.add(lane));

    // Если заняты все 3 линии, освобождаем одну случайную
    if (occupiedLanes.size === 3) {
        const lanes = Array.from(occupiedLanes);
        const laneToClear = lanes[Math.floor(Math.random() * lanes.length)];
        occupiedLanes.delete(laneToClear);

        // Убираем препятствия с освобожденной линии
        selectedPattern.obstacles = selectedPattern.obstacles.filter(lane => lane !== laneToClear);
        selectedPattern.jumpObstacles = selectedPattern.jumpObstacles.filter(lane => lane !== laneToClear);
        selectedPattern.slideObstacles = selectedPattern.slideObstacles.filter(lane => lane !== laneToClear);
    }
}
export function refreshGameState() {
    // Инициализация состояния игры
    return {
        lastObstacleReleaseTime: 0,
        isAddingObstacle: false,
        gamePaused: false,
        obstacleSpawnTimer: null,
        canJump: true,
        isJumping: false
    }
}

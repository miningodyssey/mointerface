export function releaseObstacle(obstacle, obstaclePool, jumpObstaclePool, slideObstaclePool, rampPool) {
    if (obstacle.type === 'wagon') {
        obstaclePool.release(obstacle);
    } else if (obstacle.type === 'jump') {
        jumpObstaclePool.release(obstacle);
    } else if (obstacle.type === 'slide') {
        slideObstaclePool.release(obstacle);
    } else if (obstacle.type === 'ramp') {
        rampPool.release(obstacle);
    }
}

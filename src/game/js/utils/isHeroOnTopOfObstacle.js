import * as BABYLON from 'babylonjs';

export function isHeroOnTopOfObstacle(hero, obstacle) {
    const heroBoundingBox = hero.getBoundingInfo().boundingBox;
    const obstacleBoundingBox = obstacle.getBoundingInfo().boundingBox;

    const heroMin = heroBoundingBox.minimumWorld;
    const heroMax = heroBoundingBox.maximumWorld;
    const obstacleMin = obstacleBoundingBox.minimumWorld;
    const obstacleMax = obstacleBoundingBox.maximumWorld;

    const tolerance = 0.3;
    const isOnTop = heroMin.y > (obstacleMax.y - tolerance);
    const isHorizontallyInside = heroMin.x < obstacleMax.x && heroMax.x > obstacleMin.x &&
        heroMin.z < obstacleMax.z && heroMax.z > obstacleMin.z;

    return isHorizontallyInside && isOnTop;
}

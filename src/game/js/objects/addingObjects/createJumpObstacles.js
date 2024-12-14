import {markPositionAsOccupied} from "../../utils/markPositionAsOccupied.js";
import {executeTasks, queueTask} from "../../utils/queue.js";
import {isAreaFree} from "../../utils/isAreaFree.js";

export function createJumpObstacles(
    hero,
    taskQueue,
    scene,
    heroBaseY,
    startZ,
    selectedPattern,
    numWagons,
    obstaclesInPath,
    roadBox,
    modelCache,
    occupiedPositions,
    MINIMUM_WAGON_DISTANCE,
    jumpObstaclePool,
    handleObstacleCollision,
    callback,
) {
    const tasks = [];

    for (const lane of selectedPattern.jumpObstacles) {
        const jumpObstaclePositionZ = startZ + (numWagons - 1) * MINIMUM_WAGON_DISTANCE;
        if (isAreaFree(occupiedPositions, lane, jumpObstaclePositionZ, 0.2)) {
            tasks.push(() => {
                const newJumpObstacle = jumpObstaclePool.acquire();
                if (newJumpObstacle) {
                    const position = newJumpObstacle.position.clone()
                    newJumpObstacle.position.set(lane, position.y, jumpObstaclePositionZ);
                    newJumpObstacle.setEnabled(true);
                    if (newJumpObstacle.physicsImpostor && !newJumpObstacle.collisionHandlerAdded) {
                        newJumpObstacle.physicsImpostor.registerOnPhysicsCollide(hero.physicsImpostor, (main, collided) => {
                            handleObstacleCollision(hero, newJumpObstacle)
                        });
                        newJumpObstacle.collisionHandlerAdded = true;  // Устанавливаем флаг, чтобы не добавлять обработчик повторно
                    }
                    roadBox.addChild(newJumpObstacle);
                    obstaclesInPath.push(newJumpObstacle);
                    markPositionAsOccupied(occupiedPositions, lane, jumpObstaclePositionZ, 0.5);

                    // После расстановки делаем объект видимым
                    const clonedMesh = newJumpObstacle.getChildMeshes(false)[0];
                    if (clonedMesh) {
                        clonedMesh.setEnabled(true);
                    }
                }
            });
        }
    }

    tasks.forEach(task => queueTask(taskQueue, task));
    executeTasks(taskQueue, callback, 50);
}


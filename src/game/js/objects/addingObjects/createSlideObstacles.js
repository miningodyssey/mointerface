import {isAreaFree} from "../../utils/isAreaFree.js";
import {markPositionAsOccupied} from "../../utils/markPositionAsOccupied.js";
import {executeTasks, queueTask} from "../../utils/queue.js";

export function createSlideObstacles(
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
    slideObstaclePool,
    handleObstacleCollision,
    callback,
) {
    const tasks = [];

    for (const lane of selectedPattern.slideObstacles) {
        const slideObstaclePositionZ = startZ + (numWagons - 1) * MINIMUM_WAGON_DISTANCE;
        if (isAreaFree(occupiedPositions, lane, slideObstaclePositionZ, 0.2)) {
            tasks.push(() => {
                const newSlideObstacle = slideObstaclePool.acquire();
                if (newSlideObstacle) {
                    const position = newSlideObstacle.position.clone()
                    newSlideObstacle.position.set(lane, position.y, slideObstaclePositionZ);
                    newSlideObstacle.setEnabled(true); // Включаем объект после расстановки
                    if (newSlideObstacle.physicsImpostor && !newSlideObstacle.collisionHandlerAdded) {
                        newSlideObstacle.physicsImpostor.registerOnPhysicsCollide(hero.physicsImpostor, (main, collided) => {
                            handleObstacleCollision(hero, newSlideObstacle)
                        });
                        newSlideObstacle.collisionHandlerAdded = true;  // Устанавливаем флаг, чтобы не добавлять обработчик повторно
                    }
                    roadBox.addChild(newSlideObstacle);
                    obstaclesInPath.push(newSlideObstacle);
                    markPositionAsOccupied(occupiedPositions, lane, slideObstaclePositionZ, 0.5);

                    // После расстановки делаем объект видимым
                    const clonedMesh = newSlideObstacle.getChildMeshes(false)[0];
                    if (clonedMesh) {
                        clonedMesh.setEnabled(true);
                    }
                }
            });
        }
    }

    tasks.forEach(task => queueTask(taskQueue, task));
    executeTasks(taskQueue, callback, 0);
}

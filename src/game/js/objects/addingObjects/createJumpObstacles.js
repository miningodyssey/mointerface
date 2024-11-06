import {markPositionAsOccupied} from "../../utils/markPositionAsOccupied.js";
import {executeTasks, queueTask} from "../../utils/queue.js";
import {isAreaFree} from "../../utils/isAreaFree.js";

export function createJumpObstacles(
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
    callback,
) {
    const tasks = [];

    for (const lane of selectedPattern.jumpObstacles) {
        const jumpObstaclePositionZ = startZ + (numWagons - 1) * MINIMUM_WAGON_DISTANCE;
        if (isAreaFree(occupiedPositions, lane, jumpObstaclePositionZ, 3.27)) {
            tasks.push(() => {
                const newJumpObstacle = jumpObstaclePool.acquire();
                if (newJumpObstacle) {
                    const position = newJumpObstacle.position.clone()
                    newJumpObstacle.position.set(lane, position.y, jumpObstaclePositionZ);
                    newJumpObstacle.setEnabled(true); // Включаем объект после расстановки
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


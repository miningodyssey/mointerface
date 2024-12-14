import {executeTasks} from "../../utils/queue.js";

export function createObstacles(
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
    spatialGrid,
    MINIMUM_WAGON_DISTANCE,
    FIXED_RAMP_DISTANCE,
    OBSTACLE_DISTANCE,
    MAX_OBSTACLES_PER_CALL,
    obstaclePool,
    rampPool,
    handleObstacleCollision,
    Ammo,
    callback
) {
    const tasks = [];
    let lastObstacleZ = startZ;  // Отслеживание позиции последнего препятствия
    const rampLanes = new Set();
    let obstaclesCreated = 0; // Объявляем и инициализируем переменную
    const addRampBeforeObstacle = (lane, obstacleZPosition) => {
        const rampZPosition = obstacleZPosition - FIXED_RAMP_DISTANCE;
        if (rampPool && spatialGrid.isAreaFree(lane, rampZPosition, 1)) {
            tasks.push(() => {
                const newRamp = rampPool.acquire();
                const pos = newRamp.position.clone()
                if (newRamp) {
                    newRamp.position.set(lane, pos.y, rampZPosition);

                    newRamp.setEnabled(true);
                    if (newRamp.physicsImpostor && !newRamp.collisionHandlerAdded) {
                        newRamp.physicsImpostor.registerOnPhysicsCollide(hero.physicsImpostor, (main, collided) => {

                            hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());

                            // Вызываем обработчик коллизий для рампы
                            handleObstacleCollision(hero, newRamp);
                        });
                        newRamp.collisionHandlerAdded = true;  // Устанавливаем флаг, чтобы не добавлять обработчик повторно
                    }
                    roadBox.addChild(newRamp);
                    obstaclesInPath.push(newRamp);
                    spatialGrid.markAreaAsOccupied(lane, rampZPosition, 0.5);
                    rampLanes.add(lane);
                    const clonedMesh = newRamp.getChildMeshes(false)[0];
                    if (clonedMesh) {
                        clonedMesh.setEnabled(true);
                    }
                }
            });
        }
    };

    for (const lane of selectedPattern.obstacles) {
        // Новое препятствие спавнится на фиксированном расстоянии от последнего
        const z = lastObstacleZ + OBSTACLE_DISTANCE;

        let overlap = false;
        for (const obstacle of obstaclesInPath) {
            if (obstacle.position.x === lane && Math.abs(obstacle.position.z - z) < OBSTACLE_DISTANCE) {
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            // Добавляем рампу перед препятствием, если нужно
            if (selectedPattern.ramps.includes(lane) && !rampLanes.has(lane)) {
                addRampBeforeObstacle(lane, z);
            }

            for (let j = 0; j < numWagons; j++) {
                const currentPositionZ = z + j * MINIMUM_WAGON_DISTANCE;
                if (obstaclesCreated < MAX_OBSTACLES_PER_CALL && spatialGrid.isAreaFree(lane, currentPositionZ, 5.8)) {
                    tasks.push(() => {
                        const newObstacle = obstaclePool.acquire();
                        const pos = newObstacle.position.clone()
                        if (newObstacle) {
                            if (newObstacle.physicsImpostor && !newObstacle.collisionHandlerAdded) {
                                newObstacle.physicsImpostor.registerOnPhysicsCollide(hero.physicsImpostor, (main, collided) => {

                                    handleObstacleCollision(hero, newObstacle)
                                });
                                newObstacle.collisionHandlerAdded = true;  // Устанавливаем флаг
                            }
                            newObstacle.position.set(lane, pos.y, currentPositionZ);
                            newObstacle.setEnabled(true);

                            roadBox.addChild(newObstacle);
                            obstaclesInPath.push(newObstacle);
                            spatialGrid.markAreaAsOccupied(lane, currentPositionZ, 3);
                            obstaclesCreated++;
                            const clonedMesh = newObstacle.getChildMeshes(false)[0];
                            if (clonedMesh) {
                                clonedMesh.setEnabled(true);
                            }
                        }
                    });
                }
            }

            // Обновляем позицию последнего препятствия
            lastObstacleZ = z;
        }
    }

    tasks.forEach(task => taskQueue.push(task));
    executeTasks(taskQueue, callback, 50);
}
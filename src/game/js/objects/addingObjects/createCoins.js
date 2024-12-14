import { executeTasks, queueTask } from "../../utils/queue.js";

export function createCoins(
    taskQueue,
    scene,
    heroBaseY,
    startZ,
    selectedPattern,
    coinsInPath,
    roadBox,
    modelCache,
    spatialGrid,
    MINIMUM_COIN_DISTANCE,
    MAX_COINS_PER_CALL,
    obstaclesInPath,
    coinPool,
    callback
) {
    const tasks = [];
    let coinsCreated = 0;

    for (const lane of selectedPattern.coins) {
        const numCoins = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < numCoins; i++) {
            const coinPositionZ = startZ + i * MINIMUM_COIN_DISTANCE;

            // Проверка на пересечение с препятствиями
            let overlap = false;
            for (const obstacle of obstaclesInPath) {
                if (
                    obstacle.position.x === lane &&
                    Math.abs(obstacle.position.z - coinPositionZ) < MINIMUM_COIN_DISTANCE &&
                    obstacle.type === "obstacle"
                ) {
                    overlap = true;
                    break;
                }
            }

            // Создание монеты, если зона свободна
            if (!overlap && coinsCreated < MAX_COINS_PER_CALL && spatialGrid.isAreaFree(lane, coinPositionZ, 0.5)) {
                tasks.push(() => {
                    const newCoin = coinPool.acquire();
                    if (newCoin) {
                        const position = newCoin.position.clone();
                        newCoin.position.set(lane, position.y, coinPositionZ);
                        newCoin.setEnabled(true);
                        coinsInPath.push(newCoin);
                        roadBox.addChild(newCoin);
                        spatialGrid.markAreaAsOccupied(lane, coinPositionZ, 0.5);
                        coinsCreated++;
                    }
                });
            }
        }
    }

    // Добавляем задачи в очередь и выполняем их
    tasks.forEach(task => queueTask(taskQueue, task));
    executeTasks(taskQueue, callback, 50);
}

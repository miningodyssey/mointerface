import {createSlideObstacles} from "../../objects/addingObjects/createSlideObstacles.js";
import {createJumpObstacles} from "../../objects/addingObjects/createJumpObstacles.js";
import {createCoins} from "../../objects/addingObjects/createCoins.js";
import {createObstacles} from "../../objects/addingObjects/createObstacles.js";
import {ensureManeuverability} from "./ensureManeuverability.js";
import {selectPattern} from "./selectPattern.js";
export function addObstaclesAndCoins(
    gamePaused,
    leftLane,
    middleLane,
    rightLane,
    hero,
    engine,
    scene,
    obstaclesInPath,
    coinsInPath,
    heroBaseY,
    roadBox,
    coinRotationSpeed,
    modelCache,
    isFirstSpawn,
    PATTERN_WEIGHTS,
    taskQueue,
    coinPool,
    slideObstaclePool,
    obstaclePool,
    jumpObstaclePool,
    rampPool,
    occupiedPositions,
    SpatialGrid,
    handleObstacleCollision,
    ammo
) {
    if (gamePaused) return;
    const MINIMUM_WAGON_DISTANCE = 3.19;
    const OBSTACLE_DISTANCE = 5;
    const MINIMUM_COIN_DISTANCE = 1;
    const FIXED_RAMP_DISTANCE = 3.3;
    const MAX_OBSTACLES_PER_CALL = 9;
    const MAX_COINS_PER_CALL = 24;
    const startZ = hero.position.z + 50;
    occupiedPositions = new Set();
    const selectedPattern = selectPattern(PATTERN_WEIGHTS);
    ensureManeuverability(selectedPattern);
    SpatialGrid.clearAll()
    // Check if this is the first spawn
    if (isFirstSpawn) {
        selectedPattern.obstacles = selectedPattern.obstacles.filter(obstacle => obstacle.type !== "ramp");
        const occupiedLanes = new Set();
        selectedPattern.obstacles.forEach(obstacle => occupiedLanes.add(obstacle.lane));
        selectedPattern.jumpObstacles.forEach(obstacle => occupiedLanes.add(obstacle.lane));
        selectedPattern.slideObstacles.forEach(obstacle => occupiedLanes.add(obstacle.lane));
        if (occupiedLanes.size === 3) {
            const lanes = Array.from(occupiedLanes);
            const laneToClear = lanes[Math.floor(Math.random() * lanes.length)];
            selectedPattern.obstacles = selectedPattern.obstacles.filter(obstacle => obstacle.lane !== laneToClear);
            selectedPattern.jumpObstacles = selectedPattern.jumpObstacles.filter(obstacle => obstacle.lane !== laneToClear);
            selectedPattern.slideObstacles = selectedPattern.slideObstacles.filter(obstacle => obstacle.lane !== laneToClear);
        }
    }

    createObstacles(
        hero,
        taskQueue,
        scene,
        heroBaseY,
        startZ,
        selectedPattern,
        Math.floor(Math.random() * 2) + 2,
        obstaclesInPath,
        roadBox,
        modelCache,
        SpatialGrid,
        MINIMUM_WAGON_DISTANCE,
        FIXED_RAMP_DISTANCE,
        OBSTACLE_DISTANCE,
        MAX_OBSTACLES_PER_CALL,
        obstaclePool,
        isFirstSpawn ? null : rampPool,
        handleObstacleCollision,
        ammo,
        () => {
            createCoins(
                taskQueue,
                scene,
                heroBaseY,
                startZ,
                selectedPattern,
                coinsInPath,
                roadBox,
                modelCache,
                SpatialGrid,
                MINIMUM_COIN_DISTANCE,
                MAX_COINS_PER_CALL,
                obstaclesInPath,
                coinPool,
                () => {
                    createJumpObstacles(
                        taskQueue,
                        scene,
                        heroBaseY,
                        startZ,
                        selectedPattern,
                        Math.floor(Math.random() * 2) + 2,
                        obstaclesInPath,
                        roadBox,
                        modelCache,
                        occupiedPositions,
                        MINIMUM_WAGON_DISTANCE,
                        jumpObstaclePool,
                        () => {
                            createSlideObstacles(
                                taskQueue,
                                scene,
                                heroBaseY + 0.05,
                                startZ,
                                selectedPattern,
                                Math.floor(Math.random() * 2) + 2,
                                obstaclesInPath,
                                roadBox,
                                modelCache,
                                occupiedPositions,
                                MINIMUM_WAGON_DISTANCE,
                                slideObstaclePool,
                                undefined
                            );
                        }
                    );
                }
            );
        }
    );
}


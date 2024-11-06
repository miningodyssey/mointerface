import {ObjectPool} from "../classes/objectPool";
import {createCoin} from "../objects/assets/createCoin";
import {createSlideObstacle} from "../objects/assets/createSlideObstacle";
import {createJumpObstacle} from "../objects/assets/createJumpObstacle";
import {createObstacle} from "../objects/assets/createObstacle";
import {createRamp} from "../objects/assets/createRamp";
import {createRoadSegment} from "../objects/assets/createRoadSegment";

export async function initializePools(scene, modelCache) {
    let coinPool = new ObjectPool(null, 0);
    let slideObstaclePool = new ObjectPool(null, 0);
    let jumpObstaclePool = new ObjectPool(null, 0);
    let obstaclePool = new ObjectPool(null, 0);
    let rampPool = new ObjectPool(null, 0);
    let roadSegmentPool = new ObjectPool(null, 0);

    coinPool.setCreateFunction(() => createCoin(scene, 0, 0.68, 0, modelCache.coinModel));
    slideObstaclePool.setCreateFunction(() => createSlideObstacle(scene, 0, 0.5, 0, modelCache.slideObstacleModel));
    jumpObstaclePool.setCreateFunction(() => createJumpObstacle(scene, 0, 0.45, 0, modelCache.jumpObstacleModel));
    obstaclePool.setCreateFunction(() => createObstacle(scene, 0, 0.45, 0, modelCache.subwayModel));
    rampPool.setCreateFunction(() => createRamp(scene, 0, 0.35, 0, modelCache));
    roadSegmentPool.setCreateFunction(() => createRoadSegment(scene, 0, 0.45, 0, modelCache.roadModel));

    coinPool.initialize(48)
    slideObstaclePool.initialize(6)
    jumpObstaclePool.initialize(6)
    obstaclePool.initialize(20)
    rampPool.initialize(6)
    roadSegmentPool.initialize(20)
    return {
        coinPool,
        slideObstaclePool,
        jumpObstaclePool,
        obstaclePool,
        rampPool,
        roadSegmentPool
    }
}
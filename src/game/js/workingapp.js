import {createHero} from "./objects/assets/createHero.js";
import {addObstaclesAndCoins} from "./utils/addObstaclesAndCoins/addObstaclesAndCoins.js";
import {loadMeshes} from "./utils/loadMeshes.js";
import {initializePhysics} from "./utils/initializePhysics.js";
import {detectPlatform} from "./utils/detectPlatforms.js";
import {createCoin} from "./objects/assets/createCoin.js";
import {createSlideObstacle} from "./objects/assets/createSlideObstacle.js";
import {createJumpObstacle} from "./objects/assets/createJumpObstacle.js";
import {createObstacle} from "./objects/assets/createObstacle.js";
import {createRamp} from "./objects/assets/createRamp.js";
import {ObjectPool} from "./classes/objectPool.js";
import {createRoadSegment} from "./objects/assets/createRoadSegment.js";
import {createRoadSegments} from "./objects/addingObjects/createRoadSegments.js";
import {updateRoadSegments} from "./objects/updateObjects/updateRoadSegments.js";
import {SpatialGrid} from "./classes/SpatialGrid.js";
import {createSky} from "./objects/assets/createSky.js";
import {updateSky} from "./objects/updateObjects/updateSky.js";
import {PATTERN_WEIGHTS} from "./variables/PATTERN_WEIGHTS.js";
import {clearSceneOfType} from "./utils/clearSceneOfType.js";
import {clearTaskQueue} from "./utils/queue.js";
import {endGame} from "./utils/endGame";

let canvas = document.getElementById("renderCanvas");
let pl = document.getElementById('platform').textContent
let engine = new BABYLON.Engine(canvas, true, {
    useHighPrecisionFloats: true,
    disableWebGL2Support: false
});
let scene;
let camera, light, sun, hero;
let scoreDisplay = document.getElementById('scoreDisplay');
let startButton = document.getElementById('startButton');
let restartButton = document.getElementById('restartButton');
let ammoLoaded = false;
let mapSize = 256;
let coinPool
let slideObstaclePool
let obstaclePool
let jumpObstaclePool
let rampPool
let canJump = true
let isFirstSpawn = true
let isJumping = false
let roadSegmentPool
let obstaclesInPath = [];
let coinsInPath = [];
let roadInPath = [];
let newObstacles = [];
let taskQueue = [];
let newCoins = [];
let create
let sky
let device = detectPlatform(pl)
let modelCache = {
    subwayModel: null,
    rampModel: null,
    coinModel: null,
    jumpObstacleModel: null,
    slideObstacleModel: null,
    roadModel: null,
    skyModel: null
};
let lastObstacleReleaseTime;
let obstacleSpawnTimer;
let isAddingObstacle;
let gamePaused;

export async function createScene() {
    if (!scene) {
        // Создание новой сцены
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

        // Создание камеры
        camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -6), scene);
        camera.setTarget(new BABYLON.Vector3(0, 2, 0));
        camera.rotation.x = 0.15;
        camera.rotationAutoUpdate = false;
        camera.position = new BABYLON.Vector3(0, 1.45, 2.65);
        // Создание освещения
        light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -1, 0), scene);
        sun.position = new BABYLON.Vector3(0, 6, -2);
        sun.intensity = 0.7;

        // Определение размера карты
        mapSize = (device === 'mobile') ? 128 : 1024;

        // Настройка графики для мобильных устройств
        if (device === 'mobile') {
            engine.setHardwareScalingLevel(0.4);
            setupMobileRenderingPipeline();
        } else {
            setupDesktopRenderingPipeline();
        }

        await initializePhysics(scene, ammoLoaded); // Инициализация физики

        await loadMeshesInParallel();
        await initializePools();

        // Создание героя
        create = await createHero(scene);
        sky = await createSky(scene);
        createRoadSegments(
            scene, 0.45, -1, 20, roadSegmentPool, roadInPath, 4.5
        );
    }
    initGame();
    ammoLoaded = true;
}

// Функция для настройки рендеринга на мобильных устройствах
function setupMobileRenderingPipeline() {
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
    defaultPipeline.bloomEnabled = false;
    defaultPipeline.fxaaEnabled = false;
    defaultPipeline.bloomThreshold = 0.0125;
    defaultPipeline.bloomScale = 0.1;
    defaultPipeline.bloomWeight = 0.1;
    defaultPipeline.bloomKernel = 8;
}

// Функция для настройки рендеринга на настольных устройствах
function setupDesktopRenderingPipeline() {
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
    engine.setHardwareScalingLevel(1);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.bloomThreshold = 0.001;
    defaultPipeline.bloomScale = 0.7;
    defaultPipeline.bloomWeight = 0.7;
    defaultPipeline.bloomKernel = 128;
}

// Функция для инициализации пулов объектов
async function initializePools() {
    coinPool = new ObjectPool(null, 0);
    slideObstaclePool = new ObjectPool(null, 0);
    jumpObstaclePool = new ObjectPool(null, 0);
    obstaclePool = new ObjectPool(null, 0);
    rampPool = new ObjectPool(null, 0);
    roadSegmentPool = new ObjectPool(null, 0);

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
}

// Функция для параллельной загрузки мешей
async function loadMeshesInParallel() {
    await loadMeshes('bigObstacle', scene, modelCache)
    await loadMeshes('coin', scene, modelCache)
    await loadMeshes('slideObstacle', scene, modelCache)
    await loadMeshes('jumpObstacle', scene, modelCache)
    await loadMeshes('ramp', scene, modelCache)
    await loadMeshes('road', scene, modelCache)
}


function refreshGameState() {
    // Инициализация состояния игры
    lastObstacleReleaseTime = 0;
    isAddingObstacle = false;
    gamePaused = false;
    obstacleSpawnTimer = null;
    canJump = true;
    isJumping = false
}

function clearScene(scene) {
    resetAndReturnToPool(roadInPath, roadSegmentPool)
    resetAndReturnToPool(obstaclesInPath, obstaclePool, rampPool)
    resetAndReturnToPool(newObstacles, obstaclePool, rampPool)
    resetAndReturnToPool(newCoins, coinPool)
    resetAndReturnToPool(coinsInPath, coinPool)
    clearSceneOfType(scene, 'hero');
    clearSceneOfType(scene, 'sky');
    clearTaskQueue(taskQueue)
    roadInPath.length = 0
    obstaclesInPath.length = 0
    coinsInPath.length = 0
    newCoins.length = 0
    newObstacles.length = 0
    scene.gravity = new BABYLON.Vector3(0, 0, 0); // Сброс гравитации
}

function resetAndReturnToPool(objectsArray, pool, pool2 = null) {
    objectsArray.forEach((obj) => {
        obj.setEnabled(false);  // Отключаем объект
        obj.position.set(0, obj.position.y, 0); // Сбрасываем позицию
        if (pool && pool2) {
            if (obj.type === 'ramp') {
                pool2.release(obj);
            }
            if (obj.type === 'wagon') {
                pool.release(obj);
            }
        } else {
            pool.release(obj);
        }
    });
}

startButton.addEventListener('click', () => {
    createScene();
    startButton.style.display = 'none'
    scoreDisplay.style.display = 'block'
});

restartButton.addEventListener('click', () => {
    if (scene) {
        engine.stopRenderLoop();
        clearScene(scene);
        refreshGameState();
    }

    createScene();
    restartButton.style.display = 'none';
});


async function initGame() {
    scene.unregisterBeforeRender(updateGame);
    engine.stopRenderLoop(renderLoop)
    let rollingSpeed = 14;
    let originalRollingSpeed = 14;
    let frameCount = 0;
    let spatialGrid = new SpatialGrid(0.5);
    let heroBaseY = 0.45;
    let leftLane = -0.5;
    let rightLane = 0.5;
    const gameObjects = new Set();
    let isSliding = false;
    let middleLane = 0;
    let currentLane = middleLane;
    let jumpCooldown = 0.5;
    let lastJumpTime = 0;
    let previousLane = middleLane;
    let isFirstSpawn = true;
    lastObstacleReleaseTime = 0;
    let score = 0;
    const segmentLength = 4.5;
    gamePaused = false;
    isAddingObstacle = false;
    const occupiedPositions = new Set();

    let isGrounded = true;
    let laneChangeSpeed = 5;
    let coinRotationSpeed = 0.05;
    let hero = create[0][0];
    let animations = create[1]
    currentLane = middleLane;
    previousLane = middleLane;  // Initialize previous lane

    var roadBox = BABYLON.MeshBuilder.CreateBox("ground", {
        width: 3, depth: 100
    }, scene);
    roadBox.physicsImpostor = new BABYLON.PhysicsImpostor(
        roadBox,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {mass: 0, restitution: 0},
        scene
    );
    roadBox.position.y = -0.1;
    roadBox.material = new BABYLON.StandardMaterial("groundMat", scene);
    roadBox.material.diffuseColor = new BABYLON.Color3(0.3, 0.8, 0.8);
    roadBox.visibility = 0
    if (isFirstSpawn) {
        addObstaclesAndCoins(
            gamePaused,
            leftLane,
            middleLane,
            rightLane,
            hero,
            engine,
            scene,
            newObstacles,
            newCoins,
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
            spatialGrid
        );
        newObstacles.forEach(obstacle => gameObjects.add(obstacle)); // Добавляем в Set
        newCoins.forEach(coin => gameObjects.add(coin));
    }

    function startSlide() {
        // Остановить все другие анимации героя
        if (!isSliding) {
            create[1].forEach(animation => {
                if (animation.name !== 'RUN') {
                    animation.stop();
                }
            });

            animations[5].start();
            isSliding = true;

            if (!isGrounded) {
                hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, -2, 0), hero.getAbsolutePosition()); // Negative impulse downwards
                hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero()); // Reset angular velocity
            }
            animations[5].onAnimationEndObservable.addOnce(() => {
                stopSliding();
            });
        }
    }


    function stopSliding() {
        isSliding = false;
        hero.position.z = 4;
    }

    window.addEventListener("keydown", function (event) {
        if (rollingSpeed === 0) return;
        if (event.keyCode === 37) { // Left arrow
            if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
                create[1].forEach(animation => {
                    if (animation.name !== 'RUN') {
                        animation.stop();
                    }
                });
                currentLane -= 0.5;
                create[1][1].start();
            }
        } else if (event.keyCode === 39) { // Right arrow
            if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
                create[1].forEach(animation => {
                    if (animation.name !== 'RUN') {
                        animation.stop();
                    }
                });
                currentLane += 0.5;
                create[1][2].start();
            }
        } else if (event.keyCode === 38) { // Up arrow (jump)
            if (isGrounded || canJump) { // Проверяем, что герой на земле или препятствии
                handleJump();
                hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
            }
        } else if (event.keyCode === 40) { // Down arrow (slide)
            startSlide()
        }
    });


    let startX, startY, endX, endY;

    canvas.addEventListener("pointerdown", (event) => {
        startX = event.clientX;
        startY = event.clientY;
    });

    canvas.addEventListener("pointermove", (event) => {
        if (startX !== undefined && startY !== undefined) {
            endX = event.clientX;
            endY = event.clientY;
        }
    });

    canvas.addEventListener("pointerup", () => {
        if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
                handleSwipe(deltaX, deltaY);
            }

            startX = startY = endX = endY = undefined;
        }
    });

    function handleSwipe(deltaX, deltaY) {
        previousLane = currentLane;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) { // свайп вправо
                if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
                    create[1].forEach(animation => {
                        if (animation.name !== 'RUN') {
                            animation.stop();
                        }
                    });
                    currentLane += 0.5;
                    create[1][2].start();
                }
            } else { // свайп влево
                if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
                    create[1].forEach(animation => {
                        if (animation.name !== 'RUN') {
                            animation.stop();
                        }
                    });
                    currentLane -= 0.5;
                    create[1][1].start();
                }
            }
        } else {
            if (deltaY < 0) { // свайп вверх (прыжок)
                if (isGrounded || canJump) { // Проверяем, что герой на земле или препятствии
                    handleJump();
                    hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                }
            } else if (deltaY > 0) { // свайп вниз (скольжение)
                startSlide()
            }
        }
    }


    function isLaneBlocked(lane) {
        const heroPos = hero.getAbsolutePosition();
        const heroZ = heroPos.z;
        for (const obstacle of obstaclesInPath) {
            const obstaclePos = obstacle.getAbsolutePosition();
            const aboveObstacle = heroPos.y > obstaclePos.y;
            const obstacleZ = obstaclePos.z;
            const laneBlocked = Math.abs(obstaclePos.x - lane) < 0.1;

            if (laneBlocked && obstacleZ > heroZ && (obstacleZ - heroZ) < 1 && !aboveObstacle) {
                return true;
            }
        }
        return false;
    }

    function updateCoins() {
        for (let i = coinsInPath.length - 1; i >= 0; i--) {
            const coin = coinsInPath[i];
            coin.rotate(BABYLON.Axis.Y, coinRotationSpeed, BABYLON.Space.LOCAL);

            if (BABYLON.Vector3.Distance(hero.position, coin.position) < 0.4) {
                score += 1;
                coinPool.release(coin);
                coinsInPath.splice(i, 1);
            } else if (coin.position.z < -2) {
                coinPool.release(coin);
                coinsInPath.splice(i, 1);
            }
        }
    }

    engine.runRenderLoop(renderLoop);
    window.addEventListener("resize", function () {
        engine.resize();
    });

    function renderLoop() {
        let dt = engine.getDeltaTime() / 1000; // Время с последнего кадра

        updateHeroPosition(dt)
        scene.render();

    }

    function isHeroOnTopOfObstacle(hero, obstacle) {
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

    function isHeroCollidingWithObstacle(hero, obstacle, dt) {
        const heroBoundingBox = hero.getBoundingInfo().boundingBox;
        const obstacleBoundingBox = obstacle.getBoundingInfo().boundingBox;

        const heroMin = heroBoundingBox.minimumWorld;
        const heroMax = heroBoundingBox.maximumWorld;
        const obstacleMin = obstacleBoundingBox.minimumWorld;
        const obstacleMax = obstacleBoundingBox.maximumWorld;
        let isHorizontallyInside = (
            currentLane === obstacle.position.x &&
            heroMin.z > (obstacleMin.z - 0.5) &&
            heroMax.z < obstacleMax.z
        );

        if (obstacle.type === 'wagon') {
            isHorizontallyInside = (
                currentLane === obstacle.position.x &&
                heroMin.z > obstacleMin.z - (1.475) &&
                heroMax.z < obstacleMax.z
            );
        }

        const isVerticallyAligned = heroMin.y < obstacleMax.y && heroMax.y > obstacleMin.y;

        return isHorizontallyInside && isVerticallyAligned;
    }

    function handleObstacleCollision(hero, obstacle, dt) {
        if (isHeroOnTopOfObstacle(hero, obstacle)) {
            if (isHeroOnRamp(hero, obstacle)) {
                hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
                return
            }
            if ((obstacle.type === 'wagon' || obstacle.type === 'ramp')) {
                if (!isJumping && isGrounded && (1.5 < hero.position.y && hero.position.y < 1.8)) {
                    hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                    hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                }
                return;
            }
        }

        if (isHeroCollidingWithObstacle(hero, obstacle, dt)) {

            if (obstacle.type === 'jump') {
                if (!isJumping) {
                    endGame(gameEnded, gamePaused, rollingSpeed, updateGame, restartButton, create, hasAnimationEnded, scene, hero);
                }
            } else if (obstacle.type === 'slide') {
                if (!isSliding) {
                    endGame(gameEnded, gamePaused, rollingSpeed, updateGame, restartButton, create, hasAnimationEnded, scene, hero);
                }
            } else if (obstacle.type === 'wagon') {
                hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

                endGame(gameEnded, gamePaused, rollingSpeed, updateGame, restartButton, create, hasAnimationEnded, scene, hero);
            } else {
                hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                hero.position.copyFrom(hero.position);
            }
        }
    }

    let hasAnimationEnded = false;

    function isHeroOnRamp(hero, ramp) {
        const dt = engine.getDeltaTime() / 1000;
            const heroPos = hero.getAbsolutePosition();
            const rampPos = ramp.getAbsolutePosition();

            const earlyOffset = 0;
            const lateOffset = 1.5;

            const rampLength = 3.2;
            const rampStartZ = rampPos.z;
            const rampEndZ = rampPos.z - rampLength;

            const heroX = Math.round(heroPos.x * 10) / 10;
            const rampX = Math.round(rampPos.x * 10) / 10;
            const isOnRamp =
                Math.abs(heroX - rampX) === 0 &&
                heroPos.z <= rampStartZ + lateOffset &&
                heroPos.z >= rampEndZ - earlyOffset &&
                ramp.type === 'ramp';

            if (isOnRamp) {
                if (!isJumping) {
                    // Сброс вертикальной скорости
                    hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0), hero.getAbsolutePosition()); // Negative impulse downwards
                    hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

                    // Снижение вертикальной позиции, чтобы предотвратить подлет
                    if (hero.position.y > 1.8) {
                        hero.position.y = Math.max(hero.position.y - (0.1 * dt), 1.8);
                    }
                }
                return true;
            }
        return false;
    }

    function updateHeroPosition(dt) {
        let distanceToMove = Math.abs(currentLane - hero.position.x);
        hero.rotationQuaternion.x = 0;
        hero.rotationQuaternion.y = 0;
        hero.rotationQuaternion.z = 0;
        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        if (distanceToMove > laneChangeSpeed * dt) {
            hero.position.x += Math.sign(currentLane - hero.position.x) * laneChangeSpeed * dt;
        } else {
            hero.position.x = currentLane;
        }

        const pos = hero.position.clone();
        hero.position.set(currentLane, pos.y, 4);

    }


    function updateLightDirection() {
        if (sun) {
            // Получаем позицию игрока
            const heroPosition = hero.getAbsolutePosition();

            // Направляем свет в сторону игрока
            sun.direction = heroPosition.subtract(sun.position).normalize();
        }
    }

    function roundToZero(num) {
        if (num > 0) {
            return Math.floor(num + 0.5);
        } else {
            return Math.ceil(num - 0.5);
        }
    }

    function moveElements(elements, rollingSpeed, originalRollingSpeed, dt) {
        for (const element of elements) {
            element.position.z -= rollingSpeed * dt;
        }
    }

    function updateGame() {
        var dt = engine.getDeltaTime() / 1000;
        try {
            updateLightDirection();

            // Проверка состояния игры
            if (gamePaused || document.visibilityState === "hidden") return;

            updateCoins();
            updateScoreDisplay(score);
            if (hero.physicsImpostor.getLinearVelocity().y > 5 && frameCount % 30 === 0) {
                hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            }
            // Обновление позиции камеры
            camera.position = BABYLON.Vector3.Lerp(
                camera.position,
                new BABYLON.Vector3(hero.position.x, hero.position.y + 0.7, hero.position.z - (hero.position.z * 0.3375)),
                (15 * dt)
            );
            // Обновление позиции героя
            if (hero.position.y <= heroBaseY) {
                hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
                hero.position.y = heroBaseY;
                isGrounded = roundToZero(hero.physicsImpostor.getLinearVelocity().y) === 0;
                canJump = roundToZero(hero.physicsImpostor.getLinearVelocity().y) === 0;
            } else {
                isGrounded = roundToZero(hero.physicsImpostor.getLinearVelocity().y) === 0;
            }
            hero.position.z = 4;
            frameCount += 1
            if ((!isFirstSpawn && newObstacles.length !== 0 && newObstacles[newObstacles.length - 1].position.z < 40 && frameCount % 60 === 0)
                || (isFirstSpawn && newObstacles.length !== 0 && newObstacles[newObstacles.length - 1].position.z < 30 && frameCount % 60 === 0)) {
                if (isAddingObstacle) return;
                isAddingObstacle = true;
                for (let i = 0; i < newObstacles.length; i++) {
                    const element = newObstacles[i];
                    obstaclesInPath.push(element);
                }
                for (let i = 0; i < newCoins.length; i++) {
                    const element = newCoins[i];
                    coinsInPath.push(element);
                }
                newObstacles.length = 0;
                newCoins.length = 0;
                addObstaclesAndCoins(
                    gamePaused,
                    leftLane,
                    middleLane,
                    rightLane,
                    hero,
                    engine,
                    scene,
                    newObstacles,
                    newCoins,
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
                    spatialGrid
                );
                isFirstSpawn = false
                isAddingObstacle = false;
                if (rollingSpeed < 25) {
                    rollingSpeed += 0.1;
                }
                frameCount = 0
            }
            // Двигаем препятствия
            moveElements(obstaclesInPath, rollingSpeed, originalRollingSpeed, dt);

            // Обновляем коллизии и удаление препятствий
            for (const obstacle of obstaclesInPath) {
                if (obstacle.position.z < -2 && obstacle.isEnabled()) {
                    spatialGrid.clearZone(obstacle.position.x, obstacle.position.z, obstacle.radius);
                    obstaclesInPath.splice(obstaclesInPath.indexOf(obstacle), 1);
                    releaseObstacle(obstacle);
                } else {
                    handleObstacleCollision(hero, obstacle, dt);
                }
            }

            // Двигаем монеты
            moveElements(coinsInPath, rollingSpeed, originalRollingSpeed, dt);

            // Обновляем удаление монет
            for (const coin of coinsInPath) {
                coin.rotate(BABYLON.Axis.Y, 0.01 * dt, BABYLON.Space.LOCAL);
                if (coin.position.z < 0 && coin.isEnabled()) {
                    coinsInPath.splice(coinsInPath.indexOf(coin), 1);
                    coinPool.release(coin);
                }
            }

            // Перемещаем новые препятствия в основной массив


            // Двигаем новые монеты
            moveElements(newCoins, rollingSpeed, originalRollingSpeed, dt);

            // Двигаем новые препятствия
            moveElements(newObstacles, rollingSpeed, originalRollingSpeed, dt);

            // Двигаем сегменты дороги
            moveElements(roadInPath, rollingSpeed, originalRollingSpeed, dt);

            updateRoadSegments(scene, heroBaseY, hero, roadBox, roadSegmentPool, roadInPath, segmentLength);
            updateSky(sky, dt);

        } catch (error) {
            console.error("Error in updateGame: ", error);
        }
    }

// Объединение логики освобождения объектов
    function releaseObstacle(obstacle) {
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

    scene.registerBeforeRender(updateGame);

    function handleJump() {
        if (canJump && isGrounded && hero.position.y <= 2 && ((Date.now() - lastJumpTime) >= jumpCooldown * 1000)) {
            create[1].forEach(animation => {
                if (animation.name !== 'RUN') {
                    animation.stop();
                }
            });
            isJumping = true;
            lastJumpTime = Date.now();
            hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 4, 0));
            canJump = false;
            create[1][3].start();
            setTimeout(() => {
                canJump = true;
                isJumping = false;
            }, jumpCooldown * 1000);
        }
    }
}
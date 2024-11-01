import React, {Ref, useEffect, useRef, useState} from 'react';
import {createHero} from "../js/objects/assets/createHero.js";
import {addObstaclesAndCoins} from "../js/utils/addObstaclesAndCoins/addObstaclesAndCoins.js";
import {loadMeshes} from "../js/utils/loadMeshes.js";
import {initializePhysics} from "../js/utils/initializePhysics.js";
import {detectPlatform} from "../js/utils/detectPlatforms.js";
import {createRoadSegments} from "../js/objects/addingObjects/createRoadSegments.js";
import {updateRoadSegments} from "../js/objects/updateObjects/updateRoadSegments.js";
import {SpatialGrid} from "../js/classes/SpatialGrid.js";
import {createSky} from "../js/objects/assets/createSky.js";
import {updateSky} from "../js/objects/updateObjects/updateSky.js";
import {PATTERN_WEIGHTS} from "../js/variables/PATTERN_WEIGHTS.js";
import {clearTaskQueue} from "../js/utils/queue.js";
import * as BABYLON from 'babylonjs';
import {updateScoreDisplay} from "@/game/js/utils/updateScoreDisplay";
import {handleJump} from "@/game/js/utils/handleJump";
import {isHeroOnRamp} from "@/game/js/utils/isHeroOnRamp";
import {endGame} from "@/game/js/utils/endGame";
import {isHeroOnTopOfObstacle} from "@/game/js/utils/isHeroOnTopOfObstacle";
import {setupDesktopRenderingPipeline, setupMobileRenderingPipeline} from "@/game/js/utils/settings";
import {releaseObstacle} from "@/game/js/utils/releaseObstacle";
import {ObjectPool} from "@/game/js/classes/objectPool";
import {createCoin} from "@/game/js/objects/assets/createCoin";
import {createSlideObstacle} from "@/game/js/objects/assets/createSlideObstacle";
import {createJumpObstacle} from "@/game/js/objects/assets/createJumpObstacle";
import {createObstacle} from "@/game/js/objects/assets/createObstacle";
import {createRamp} from "@/game/js/objects/assets/createRamp";
import {createRoadSegment} from "@/game/js/objects/assets/createRoadSegment";
import {Button, Spinner} from "@telegram-apps/telegram-ui";
import styles from './GameComponent.module.css'
import EndModal from "@/components/menus/EndModal/EndModal";
import PauseModal from "@/components/menus/PauseModal/PauseModal";

interface GameComponentInterface {
    t: any;
    setGameButtonClicked: any;
    userData: any;
    setUserData: any;
}

export const GameComponent: React.FC<GameComponentInterface> = ({t, setGameButtonClicked, userData, setUserData}) => {
    const canvasRef = useRef<any>(null);
    const platformRef = useRef<HTMLDivElement | null>(null);
    const scoreDisplayRef = useRef<HTMLDivElement | null>(null);
    const restartButtonRef = useRef<HTMLButtonElement | null>(null);
    const backToMenuOnEndMenuRef = useRef<HTMLButtonElement | null>(null);
    const backToMenuOnPauseMenuRef = useRef<HTMLButtonElement | null>(null);
    const endMenuContRef = useRef<HTMLSpanElement | null>(null);
    const pauseMenuContRef = useRef<HTMLSpanElement | null>(null);
    const pauseButtonRef = useRef<HTMLButtonElement | null>(null);
    const resumeButtonRef = useRef<HTMLButtonElement | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [sceneCreated, setSceneCreated] = useState(false);
    const setIsPaused = (isPaused: boolean) => {
        if (pauseMenuContRef.current) {
            pauseMenuContRef.current.style.display = isPaused ? 'block' : 'none';
        }
    };

    const handlePauseClick = () => {
        setIsPaused(true);
    };
    useEffect(() => {
        const loadBabylonScripts = async () => {
            return new Promise((resolve) => {
                const gltfLoaderScript = document.createElement('script');
                gltfLoaderScript.src = 'https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.js';
                gltfLoaderScript.async = true;
                gltfLoaderScript.onload = () => {
                    const generalLoaderScript = document.createElement('script');
                    generalLoaderScript.src = 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js';
                    generalLoaderScript.async = true;
                    generalLoaderScript.onload = resolve;
                    document.body.appendChild(generalLoaderScript);
                };
                document.body.appendChild(gltfLoaderScript);
            });
        };
        loadBabylonScripts().then(() => setScriptsLoaded(true))
    }, []);

    useEffect(() => {
        let canvas = canvasRef.current;
        let pl = platformRef.current?.textContent || "android";
        let scoreDisplay = scoreDisplayRef.current;
        let restartButton = restartButtonRef.current;
        let endMenu = endMenuContRef.current
        let pauseMenu = pauseMenuContRef.current;
        let pauseButton = pauseButtonRef.current;
        let resumeButton = resumeButtonRef.current;
        let backToMenuOnEndMenu = backToMenuOnEndMenuRef.current;
        let backToMenuOnPauseMenu = backToMenuOnPauseMenuRef.current;
        let engine = new BABYLON.Engine(canvas, true, {
            useHighPrecisionFloats: true,
            disableWebGL2Support: false
        });
        let scene: any;
        let camera: any, light: any, sun: any, hero: any;
        let mapSize: number = 256;
        let coinPool: any
        let slideObstaclePool: any
        let obstaclePool: any
        let jumpObstaclePool: any
        let rampPool: any
        let canJump: any = true
        let isFirstSpawn: any = true
        let isJumping: any = false
        let roadSegmentPool: any
        let obstaclesInPath: any[] = [];
        let coinsInPath: any[] = [];
        let roadInPath: any[] = [];
        let newObstacles: any[] = [];
        let taskQueue: any[] = [];
        let newCoins: any[] = [];
        let create: any[]
        let sky: any
        let device: any = detectPlatform(pl)
        let modelCache = {
            subwayModel: null,
            rampModel: null,
            coinModel: null,
            jumpObstacleModel: null,
            slideObstacleModel: null,
            roadModel: null,
            skyModel: null
        };
        let lastObstacleReleaseTime: any;
        let obstacleSpawnTimer: any;
        let isAddingObstacle: any;
        let gamePaused: any;
        if (scriptsLoaded) {
            createScene(false).then(() => {
                if (scoreDisplay) {
                    scoreDisplay.style.display = 'block'
                }
            });
        }

        async function createScene(ammoLoaded: boolean) {
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
                setupMobileRenderingPipeline(engine, scene, camera);
            } else {
                setupDesktopRenderingPipeline(engine, scene, camera);
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
            initGame().then(() => {
                setSceneCreated(true)
            });
        }

        async function loadMeshesInParallel() {
            await loadMeshes('bigObstacle', scene, modelCache)
            await loadMeshes('coin', scene, modelCache)
            await loadMeshes('slideObstacle', scene, modelCache)
            await loadMeshes('jumpObstacle', scene, modelCache)
            await loadMeshes('ramp', scene, modelCache)
            await loadMeshes('road', scene, modelCache)
        }

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

        function refreshGameState() {
            // Инициализация состояния игры
            lastObstacleReleaseTime = 0;
            isAddingObstacle = false;
            gamePaused = false;
            obstacleSpawnTimer = null;
            canJump = true;
            isJumping = false
        }


        function clearScene(scene: any) {
            scene.meshes.forEach((mesh: any) => mesh.dispose());
            scene.lights.forEach((light: any) => light.dispose());
            scene.cameras.forEach((camera: any) => camera.dispose());
            scene.materials.forEach((material: any) => material.dispose());
            scene.textures.forEach((texture: any) => texture.dispose());
            roadInPath.length = 0
            obstaclesInPath.length = 0
            coinsInPath.length = 0
            newCoins.length = 0
            newObstacles.length = 0
            clearTaskQueue(taskQueue)
            scene.gravity = new BABYLON.Vector3(0, 0, 0); // Сброс гравитации
            scene.dispose();
        }

        if (restartButton) {
            restartButton.addEventListener('click', () => {
                if (scene) {
                    engine.stopRenderLoop();
                    clearScene(scene);
                    refreshGameState();
                }
                if (endMenu) {
                    endMenu.style.display = 'none'
                }
                setSceneCreated(false)
                createScene(true).then(() => {
                    setSceneCreated(true)
                });
                setIsModalOpen(false)
            });

        }

        const handleBackToMenuClick = () => {
            if (scene) {
                engine.stopRenderLoop();
                clearScene(scene);
                refreshGameState();
            }
            if (endMenu) {
                endMenu.style.display = 'none';
            }
            if (pauseMenuContRef.current) {
                pauseMenuContRef.current.style.display = 'none';
            }
            setGameButtonClicked(false);
        };

        if (backToMenuOnPauseMenu && backToMenuOnEndMenu) {
            backToMenuOnPauseMenu.addEventListener('click', () => handleBackToMenuClick());
            backToMenuOnEndMenu.addEventListener('click', () => handleBackToMenuClick());

        }

        async function initGame() {
            scene.unregisterBeforeRender(updateGame);
            engine.stopRenderLoop(renderLoop);
            if (pauseButton) {
                pauseButton.style.display = 'block'
                pauseButton.addEventListener('click', () => {
                    scene.unregisterBeforeRender(updateGame);
                    engine.stopRenderLoop(renderLoop);
                })
            }
            if (resumeButton) {
                resumeButton.addEventListener('click', () => {
                    scene.registerBeforeRender(updateGame);
                    engine.runRenderLoop(renderLoop);
                })
            }
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
            let gameEnded = false
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
            const groundImpostor = roadBox.physicsImpostor = new BABYLON.PhysicsImpostor(
                roadBox,
                BABYLON.PhysicsImpostor.BoxImpostor,
                {mass: 0, restitution: 0},
                scene
            );
            hero.physicsImpostor.registerOnPhysicsCollide(groundImpostor, () => {
                isGrounded = true;
                canJump = true;
            });
            roadBox.position.y = -0.1;
            roadBox.material = new BABYLON.StandardMaterial("groundMat", scene);
            roadBox.visibility = 1
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
                    create[1].forEach((animation: any) => {
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

            function handleKeyDown(event: KeyboardEvent) {
                if (!gameEnded || (rollingSpeed === 0)) {
                    if (rollingSpeed === 0) return;
                    if (event.keyCode === 37) { // Left arrow
                        if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
                            create[1].forEach((animation: any) => {
                                if (animation.name !== 'RUN') {
                                    animation.stop();
                                }
                            });
                            currentLane -= 0.5;
                            create[1][1].start();
                        }
                    } else if (event.keyCode === 39) { // Right arrow
                        if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
                            create[1].forEach((animation: any) => {
                                if (animation.name !== 'RUN') {
                                    animation.stop();
                                }
                            });
                            currentLane += 0.5;
                            create[1][2].start();
                        }
                    } else if (event.keyCode === 38) { // Up arrow (jump)
                        if (isGrounded && (((Date.now() - lastJumpTime) >= jumpCooldown * 1000))) {
                            lastJumpTime = Date.now()
                            isGrounded = handleJump(hero, create);
                        }
                    } else if (event.keyCode === 40) { // Down arrow (slide)
                        startSlide();
                    }
                }
            }
            let startX: any, startY: any, endX: any, endY: any
            function handlePointerDown(event: PointerEvent) {
                startX = event.clientX;
                startY = event.clientY;
            }

            function handlePointerMove(event: PointerEvent) {
                if (startX !== undefined && startY !== undefined) {
                    endX = event.clientX;
                    endY = event.clientY;
                }
            }

            function handlePointerUp() {
                if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
                    const deltaX = endX - startX;
                    const deltaY = endY - startY;

                    if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
                        handleSwipe(deltaX, deltaY);
                    }

                    startX = startY = endX = endY = undefined;
                }
            }

            window.addEventListener("keydown", handleKeyDown);
            canvas.addEventListener("pointerdown", handlePointerDown);
            canvas.addEventListener("pointermove", handlePointerMove);
            canvas.addEventListener("pointerup", handlePointerUp);

            function removeAllEventListeners() {
                window.removeEventListener("keydown", handleKeyDown);
                canvas.removeEventListener("pointerdown", handlePointerDown);
                canvas.removeEventListener("pointermove", handlePointerMove);
                canvas.removeEventListener("pointerup", handlePointerUp);
            }

            function handleSwipe(deltaX: any, deltaY: any) {
                if (!gameEnded || (rollingSpeed === 0)) {
                    previousLane = currentLane;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX > 0) {
                            if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
                                create[1].forEach((animation: any) => {
                                    if (animation.name !== 'RUN') {
                                        animation.stop();
                                    }
                                });
                                currentLane += 0.5;
                                create[1][2].start();
                            }
                        } else {
                            if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
                                create[1].forEach((animation: any) => {
                                    if (animation.name !== 'RUN') {
                                        animation.stop();
                                    }
                                });
                                currentLane -= 0.5;
                                create[1][1].start();
                            }
                        }
                    } else {
                        if (deltaY < 0) {
                            if (isGrounded && (((Date.now() - lastJumpTime) >= jumpCooldown * 1000))) {
                                lastJumpTime = Date.now();
                                isGrounded = handleJump(hero, create) ;
                            }
                        } else if (deltaY > 0) {
                            startSlide()
                        }
                    }
                }
            }


            function isLaneBlocked(lane: any) {
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


            function isHeroCollidingWithObstacle(hero: any, obstacle: any, dt: any) {
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

            function handleObstacleCollision(hero: any, obstacle: any, dt: any) {
                if (isHeroOnTopOfObstacle(hero, obstacle)) {
                    if (isHeroOnRamp(hero, obstacle, engine, isJumping)) {
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
                            endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen,endMenu, pauseButton);
                            removeAllEventListeners()
                        }
                    } else if (obstacle.type === 'slide') {
                        if (!isSliding) {
                            endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton);
                            removeAllEventListeners()
                        }
                    } else if (obstacle.type === 'wagon') {
                        hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

                        endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton);
                        removeAllEventListeners()

                    } else {
                        hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                        hero.position.copyFrom(hero.position);
                    }
                }
            }

            let hasAnimationEnded = false;


            function updateHeroPosition(dt: any) {
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


            function moveElements(elements: any, rollingSpeed: any, originalRollingSpeed: any, dt: any) {
                for (const element of elements) {
                    element.position.z -= rollingSpeed * dt;
                }
            }

            function updateGame() {
                let dt = engine.getDeltaTime() / 1000;
                try {
                    if (endMenu) {
                        endMenu.style.display = 'none'
                    }
                    updateLightDirection();

                    // Проверка состояния игры
                    if (gamePaused || document.visibilityState === "hidden") return;

                    updateCoins();
                    updateScoreDisplay(scoreDisplay, score);
                    if (hero.physicsImpostor.getLinearVelocity().y > 4 && frameCount % 30 === 0) {
                        hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
                    }
                    // Обновление позиции камеры
                    camera.position = BABYLON.Vector3.Lerp(
                        camera.position,
                        new BABYLON.Vector3(hero.position.x, hero.position.y + 0.7, hero.position.z - (hero.position.z * 0.3375)),
                        (15 * dt)
                    );

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
                            releaseObstacle(obstacle, obstaclePool, jumpObstaclePool, slideObstaclePool, rampPool);
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
            scene.registerBeforeRender(updateGame);
        }
    }, [scriptsLoaded]);

    return (
        <div>
            <Button ref={pauseButtonRef} onClick={handlePauseClick} className={styles.PauseBtn}>
                {t('Pause')}
            </Button>
            {(!scriptsLoaded || !sceneCreated) && (
                <div className={styles.SpinnerContainer}>
                    <Spinner className={styles.Spinner} size='m'/>
                </div>
            )}
            <canvas id="renderCanvas" style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                left: '0',
                top: '0',
                zIndex: '10',
            }} ref={canvasRef}></canvas>
            <div id="platform" style={{display: 'none'}} ref={platformRef}>Desktop</div>
            <div className={styles.ScoreBoard} style={{display: 'none'}} ref={scoreDisplayRef}>Score: 0</div>
            <span ref={endMenuContRef} style={{display: 'none'}}>
                <EndModal
                    restartButtonRef={restartButtonRef}
                    backToMenuRef={backToMenuOnEndMenuRef}
                    setIsModalOpen={setIsModalOpen}
                    t={t}
                />
            </span>
            <span ref={pauseMenuContRef} style={{display: 'none'}}>
                <PauseModal
                    setIsPaused={setIsPaused}
                    resumeButtonRef={resumeButtonRef}
                    backToMenuRef={backToMenuOnPauseMenuRef}
                    t={t}
                />
            </span>
        </div>
    );
}

export default GameComponent;

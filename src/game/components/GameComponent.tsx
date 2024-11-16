import React, {useEffect, useRef, useState} from 'react';
import {createHero} from "../js/objects/assets/createHero.js";
import {addObstaclesAndCoins} from "../js/utils/addObstaclesAndCoins/addObstaclesAndCoins.js";
import {loadAllMeshes} from "../js/utils/loadMeshes.js";
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
import {isHeroOnRamp} from "@/game/js/utils/isHeroOnRamp";
import {endGame} from "@/game/js/utils/endGame";
import {isHeroOnTopOfObstacle} from "@/game/js/utils/isHeroOnTopOfObstacle";
import {
    setupRenderingPipeline
} from "@/game/js/utils/settings";
import {releaseObstacle} from "@/game/js/utils/releaseObstacle";
import {Button, Spinner} from "@telegram-apps/telegram-ui";
import styles from './GameComponent.module.css'
import EndModal from "@/components/menus/EndModal/EndModal";
import PauseModal from "@/components/menus/PauseModal/PauseModal";
import {addEnergyRequest} from "@/components/functions/addEnergyRequest";
import {refreshGameState} from "@/game/js/utils/refreshGameState";
import {initializePools} from "@/game/js/utils/initializePools";
import {clearScene} from "@/game/js/utils/clearScene";
import {
    handleKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSwipe, removeAllEventListeners
} from "@/game/js/utils/initializeHandling";

interface GameComponentInterface {
    t: any;
    setGameButtonClicked: any;
    userData: any;
    setUserData: any;
    settings: any;
}

export const GameComponent: React.FC<GameComponentInterface> = ({
                                                                    t,
                                                                    setGameButtonClicked,
                                                                    userData,
                                                                    setUserData,
                                                                    settings
                                                                }) => {
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

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [sceneCreated, setSceneCreated] = useState(false);
    const [score, setScore] = useState(0);
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
        let restartGame: any
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
            setupRenderingPipeline(engine, scene, camera, settings)

            await initializePhysics(scene, ammoLoaded); // Инициализация физики
            modelCache = await loadAllMeshes(scene);
            ({
                coinPool,
                slideObstaclePool,
                jumpObstaclePool,
                obstaclePool,
                rampPool,
                roadSegmentPool
            } = await initializePools(scene, modelCache));

            create = await createHero(scene);
            sky = await createSky(scene);
            createRoadSegments(
                scene, 0.45, -1, 20, roadSegmentPool, roadInPath, 4.5
            );
            initGame().then(() => {
                setSceneCreated(true)
            });
        }


        const handleBackToMenuClick = () => {
            if (scene) {
                engine.stopRenderLoop();
                clearScene(scene, roadInPath, obstaclesInPath, coinsInPath, newCoins, newObstacles, taskQueue);
                ({
                    lastObstacleReleaseTime,
                    isAddingObstacle,
                    gamePaused,
                    obstacleSpawnTimer,
                    canJump,
                    isJumping
                } = refreshGameState());
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
            let savedRollingSpeed = 0;
            let rollingSpeed = 14;
            let originalRollingSpeed = 14;
            gamePaused = false;
            scene.unregisterBeforeRender(updateGame);
            engine.stopRenderLoop(renderLoop);
            let prevSessionScore = 0;

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
            isAddingObstacle = false;
            const occupiedPositions = new Set();
            let gameEnded = false
            let isGrounded = true;
            let laneChangeSpeed = 1;
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
            const addJumpPhysics = () => {
                hero.physicsImpostor.registerOnPhysicsCollide(groundImpostor, () => {
                    isGrounded = true;
                    canJump = true;
                });
            }
            addJumpPhysics();
            roadBox.position.y = -0.1;
            roadBox.material = new BABYLON.StandardMaterial("groundMat", scene);
            roadBox.visibility = 1
            const firstSpawn = () => {
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

            }
            firstSpawn();

            function startSlide() {
                // Остановить все другие анимации героя
                if (!isSliding) {
                    create[1].forEach((animation: any) => {
                        if (animation.name !== 'RUN') {
                            animation.stop();
                        }
                    });

                    animations[2].start();
                    isSliding = true;

                    if (!isGrounded) {
                        hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, -2, 0), hero.getAbsolutePosition()); // Negative impulse downwards
                        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero()); // Reset angular velocity
                    }
                    animations[2].onAnimationEndObservable.addOnce(() => {
                        stopSliding();
                    });
                }
            }


            function stopSliding() {
                isSliding = false;
                hero.position.z = 4;
            }

            function sliding() {
                startSlide()
            }

            let startX: any, startY: any, endX: any, endY: any;

            function onKeyDown(event: any) {
                const result = handleKeyDown(event, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, sliding);
                if (result) {
                    currentLane = result.currentLane;
                    lastJumpTime = result.lastJumpTime;
                    isGrounded = result.isGrounded;
                }
            }

            function onPointerDown(event: any) {
                const result = handlePointerDown(event, startX, startY);
                startX = result.startX;
                startY = result.startY;
            }

            function onPointerMove(event: any) {
                const result = handlePointerMove(event, startX, startY, endX, endY);
                if (result) {
                    endX = result.endX;
                    endY = result.endY;
                }
            }

            function onPointerUp() {
                const result = handlePointerUp(startX, startY, endX, endY, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, startSlide, previousLane);
                if (result) {
                    const {deltaX, deltaY} = result;
                    const pos = handleSwipe(deltaX, deltaY, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, sliding, previousLane);
                    currentLane = pos.currentLane;
                    previousLane = pos.previousLane;
                    lastJumpTime = pos.lastJumpTime;
                    isGrounded = pos.isGrounded;
                }
            }

            const activateHandling = () => {
                window.addEventListener("keydown", onKeyDown);
                canvas.addEventListener("pointerdown", onPointerDown);
                canvas.addEventListener("pointermove", onPointerMove);
                canvas.addEventListener("pointerup", onPointerUp);
            }

            activateHandling();


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

            engine.runRenderLoop(renderLoop);
            window.addEventListener("resize", function () {
                engine.resize();
            });

            function renderLoop() {
                if (!gamePaused) {
                    let dt = engine.getDeltaTime() / 1000; // Время с последнего кадра

                    updateHeroPosition(dt)
                    scene.render();
                }
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
                        if (!isJumping) {
                            hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
                        }
                        return
                    }
                }
                if ((obstacle.type === 'ramp') || (obstacle.type === 'wagon')) {
                    if ((!isJumping) && (1.2 < hero.position.y && hero.position.y < 1.5) && (obstacle.type === 'ramp')) {
                        hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                        return;
                    }
                    if ((1.2 < hero.position.y && hero.position.y < 1.5)) {
                        return;
                    }
                }

                if (isHeroCollidingWithObstacle(hero, obstacle, dt)) {

                    if (obstacle.type === 'jump') {
                        if (!isJumping) {
                            endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton, userData, setUserData, (score - prevSessionScore), score);
                            prevSessionScore = score;
                            removeAllEventListeners(canvas, onKeyDown, onPointerDown, onPointerUp, onPointerMove)
                        }
                    } else if (obstacle.type === 'slide') {
                        if (!isSliding) {
                            endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton, userData, setUserData, (score - prevSessionScore), score);
                            prevSessionScore = score;
                            removeAllEventListeners(canvas, onKeyDown, onPointerDown, onPointerUp, onPointerMove)
                        }
                    } else if (obstacle.type === 'wagon') {
                        hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                        hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                        endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton, userData, setUserData, (score - prevSessionScore), score);
                        prevSessionScore = score;
                        removeAllEventListeners(canvas, onKeyDown, onPointerDown, onPointerUp, onPointerMove)

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
                if (hero.physicsImpostor) {
                    hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
                }
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
                    const heroPosition = hero.getAbsolutePosition();

                    sun.direction = heroPosition.subtract(sun.position).normalize();
                }
            }


            function updateAndCleanObjects(
                objects: any[],
                speed: number,
                threshold: number,
                dt: number,
                rampPool: any,
                coinPool: any,
                jumpObstaclePool: any,
                slideObstaclePool: any,
                obstaclePool: any
            ) {
                for (let i = objects.length - 1; i >= 0; i--) {
                    const obj = objects[i];

                    obj.position.z += speed * dt;

                    if (obj.type === 'coin') {
                        obj.rotate(BABYLON.Axis.Y, coinRotationSpeed, BABYLON.Space.LOCAL);
                        if (BABYLON.Vector3.Distance(hero.position, obj.position) < 0.4) {
                            score += 1;
                            setScore(score);
                            updateScoreDisplay(scoreDisplay, score);
                            coinPool.release(obj);  // Возвращаем монету в пул coinPool
                            objects.splice(i, 1);   // Удаляем из массива объектов
                        }
                    } else if (obj.type === 'ramp') {
                        if (obj.position.z < threshold && obj.isEnabled()) {
                            objects.splice(i, 1);
                            rampPool.release(obj);  // Возвращаем рампу в пул rampPool
                        }
                    } else if (obj.type === 'jumpObstacle') {
                        if (obj.position.z < threshold && obj.isEnabled()) {
                            objects.splice(i, 1);
                            jumpObstaclePool.release(obj);  // Возвращаем jumpObstacle в пул jumpObstaclePool
                        }
                    } else if (obj.type === 'slideObstacle') {
                        if (obj.position.z < threshold && obj.isEnabled()) {
                            objects.splice(i, 1);
                            slideObstaclePool.release(obj);
                        }
                    } else if (obj.type === 'bigObstacle') {
                        if (obj.position.z < threshold && obj.isEnabled()) {
                            objects.splice(i, 1);
                            obstaclePool.release(obj);
                        }
                    }

                    if (obj.position.z < threshold && obj.isEnabled()) {
                        objects.splice(i, 1);
                        if (obj.type === 'ramp') {
                            rampPool.release(obj);
                        } else if (obj.type === 'coin') {
                            coinPool.release(obj);
                        } else if (obj.type === 'jumpObstacle') {
                            jumpObstaclePool.release(obj);
                        } else if (obj.type === 'slideObstacle') {
                            slideObstaclePool.release(obj);
                        } else if (obj.type === 'bigObstacle') {
                            obstaclePool.release(obj);
                        }
                    }
                }
            }

            const pauseGame = () => {
                savedRollingSpeed = rollingSpeed;
                rollingSpeed = 0;
                gamePaused = true
                if (pauseButton) {
                    pauseButton.style.display = 'none';
                }
                if (scoreDisplay) {
                    scoreDisplay.style.display = 'none';
                }
            }

            function handleVisibilityChange() {
                if (document.hidden && !gamePaused) {
                    setIsPaused(true)
                    pauseGame();
                }
            }

            function handleBlur() {
                if (!gamePaused) {
                    setIsPaused(true)
                    pauseGame();
                }
            }

            document.addEventListener("visibilitychange", handleVisibilityChange);

            window.addEventListener('blur', handleBlur);

            let hasCreatedObstacles = false; // Флаг для отслеживания вызова функции


            function updateGame() {
                let dt = engine.getDeltaTime() / 1000;
                try {
                    if (endMenu) {
                        endMenu.style.display = 'none'
                    }
                    updateLightDirection();

                    updateScoreDisplay(scoreDisplay, score);
                    if (hero.physicsImpostor && hero.physicsImpostor.getLinearVelocity().y > 4 && frameCount % 30 === 0) {
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
                            rollingSpeed += 1.5;
                        }
                        frameCount = 0
                    }

                    if (obstaclesInPath.length === 0 && coinsInPath.length === 0 && newObstacles.length === 0 && newCoins.length === 0) {
                        if (!hasCreatedObstacles) {
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
                            hasCreatedObstacles = true;
                        }
                    } else {
                        hasCreatedObstacles = false;
                    }

                    // Двигаем препятствия
                    updateAndCleanObjects(
                        obstaclesInPath,
                        -rollingSpeed,
                        -2,
                        dt,
                        rampPool,
                        coinPool,
                        jumpObstaclePool,
                        slideObstaclePool,
                        obstaclePool
                    );

                    updateAndCleanObjects(
                        coinsInPath,
                        -rollingSpeed,
                        0,
                        dt,
                        rampPool,
                        coinPool,
                        jumpObstaclePool,
                        slideObstaclePool,
                        obstaclePool
                    );

                    updateAndCleanObjects(
                        newCoins,
                        -rollingSpeed,
                        0,
                        dt,
                        rampPool,
                        coinPool,
                        jumpObstaclePool,
                        slideObstaclePool,
                        obstaclePool
                    );

                    updateAndCleanObjects(
                        newObstacles,
                        -rollingSpeed,
                        -2,
                        dt,
                        rampPool,
                        coinPool,
                        jumpObstaclePool,
                        slideObstaclePool,
                        obstaclePool
                    );

                    updateAndCleanObjects(
                        roadInPath,
                        -rollingSpeed,
                        -segmentLength,
                        dt,
                        rampPool,
                        coinPool,
                        jumpObstaclePool,
                        slideObstaclePool,
                        obstaclePool
                    );

                    // Обновляем коллизии и удаление препятствий
                    for (const obstacle of obstaclesInPath) {
                        if (obstacle.position.z < 10) {
                            handleObstacleCollision(hero, obstacle, dt);
                        }
                    }


                    updateRoadSegments(scene, heroBaseY, hero, roadBox, roadSegmentPool, roadInPath, segmentLength);
                    updateSky(sky, dt);

                } catch (error) {
                    console.error("Error in updateGame: ", error);
                }
            }

            scene.registerBeforeRender(updateGame);

            if (pauseButton) {
                pauseButton.style.display = 'block'
                pauseButton.addEventListener('click', pauseGame)
            }
            if (resumeButton) {
                resumeButton.addEventListener('click', () => {
                    rollingSpeed = savedRollingSpeed;
                    gamePaused = false
                    if (pauseMenuContRef.current) {
                        pauseMenuContRef.current.style.display = 'block';
                    }
                    if (pauseButton) {
                        pauseButton.style.display = 'block';
                    }
                    if (scoreDisplay) {
                        scoreDisplay.style.display = 'block';
                    }
                })
            }
            restartGame = async () => {
                {
                    if (((userData.energy - 1) < 0) && userData.admin === false) {
                        return;
                    }
                    for (const coin of coinsInPath) {
                        coinPool.release(coin);
                    }
                    for (const obstacle of obstaclesInPath) {
                        spatialGrid.clearZone(obstacle.position.x, obstacle.position.z, obstacle.radius);
                        releaseObstacle(obstacle, obstaclePool, jumpObstaclePool, slideObstaclePool, rampPool);
                    }
                    for (const coin of newCoins) {
                        coinPool.release(coin);
                    }
                    for (const obstacle of newObstacles) {
                        spatialGrid.clearZone(obstacle.position.x, obstacle.position.z, obstacle.radius);
                        releaseObstacle(obstacle, obstaclePool, jumpObstaclePool, slideObstaclePool, rampPool);
                    }
                    obstaclesInPath.length = 0;
                    coinsInPath.length = 0;
                    newCoins.length = 0;
                    newObstacles.length = 0;
                    clearTaskQueue(taskQueue);
                    activateHandling()
                    isFirstSpawn = true;
                    firstSpawn();
                    rollingSpeed = 14;

                    if (endMenu) {
                        endMenu.style.display = 'none';
                    }

                    // Сбрасываем анимацию на начало и запускаем в цикле
                    create[1][0].goToFrame(0);
                    create[1][0].start(true);

                    addEnergyRequest(userData.id, -1).then((data) => {
                        const updatedData = {...userData, energy: data.energy, lastUpdated: data.lastUpdated};
                        setUserData(updatedData);
                        setIsModalOpen(false);
                    });
                    refreshGameState()
                    currentLane = middleLane
                    scene.registerBeforeRender(updateGame);

                    if (pauseButton) {
                        pauseButton.style.display = 'block';
                    }
                }
            }

            if (restartButton) {
                restartButton.addEventListener('click', restartGame);
                rollingSpeed = 14;

            }

        }


        return () => {
            if (restartButton) {
                restartButton.removeEventListener('click', restartGame);
            }
        };
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
                    userData={userData}
                    scoreDisplay={scoreDisplayRef.current?.textContent}
                    restartButtonRef={restartButtonRef}
                    backToMenuRef={backToMenuOnEndMenuRef}
                    setIsModalOpen={setIsModalOpen}
                    t={t}
                />
            </span>
            <span ref={pauseMenuContRef} style={{display: 'none'}}>
                <PauseModal
                    scoreDisplay={score}
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

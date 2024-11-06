import {clearTaskQueue} from "./queue";
import BABYLON from "babylonjs";

export function clearScene(scene, roadInPath, obstaclesInPath, coinsInPath, newCoins, newObstacles, taskQueue) {
    scene.meshes.forEach((mesh) => mesh.dispose());
    scene.lights.forEach((light) => light.dispose());
    scene.cameras.forEach((camera) => camera.dispose());
    scene.materials.forEach((material) => material.dispose());
    scene.textures.forEach((texture) => texture.dispose());
    roadInPath.length = 0
    obstaclesInPath.length = 0
    coinsInPath.length = 0
    newCoins.length = 0
    newObstacles.length = 0
    clearTaskQueue(taskQueue);
    scene.gravity = new BABYLON.Vector3(0, 0, 0); // Сброс гравитации
    scene.dispose();
}
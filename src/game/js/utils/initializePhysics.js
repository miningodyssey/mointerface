import * as BABYLON from 'babylonjs';
import Ammo from 'ammo.js';

export async function initializePhysics(scene, ammoLoaded) {
  if (!ammoLoaded) {
    await Ammo(); // Ожидаем загрузки Ammo.js
  }
  const gravityVector = new BABYLON.Vector3(0, -14.81, 0);
  const physicsPlugin = new BABYLON.AmmoJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);
  scene.getPhysicsEngine().setTimeStep(1 / 120);
}

export async function createHero(scene, skin) {
  const { meshes, animationGroups } = await BABYLON.SceneLoader.ImportMeshAsync("", "/models/heroes/", `${skin}.glb`, scene);
  const model = meshes[0];
  model.scaling = new BABYLON.Vector3(5, 5, 5);
  model.rotation = new BABYLON.Vector3(0, 0, 0);

  // Создаем физический импостор с использованием BoxImpostor
  model.physicsImpostor = new BABYLON.PhysicsImpostor(model, BABYLON.PhysicsImpostor.MeshImpostor, {
    mass: 1,
    restitution: 0.5,
    friction: 0.5,
    fixedRotation: true,
    inertia: new BABYLON.Vector3(0, 1, 0)
  }, scene);


  model.physicsImpostor.physicsBody.setCcdMotionThreshold(0.2);
  model.physicsImpostor.physicsBody.setCcdSweptSphereRadius(1.2);

  meshes.type = 'hero'
  return [meshes, animationGroups];
}

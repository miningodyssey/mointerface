export async function createHero(scene) {
  const { meshes, animationGroups } = await BABYLON.SceneLoader.ImportMeshAsync("", "/models/heroes/", "Original version.glb", scene);
  const model = meshes[0];
  model.scaling = new BABYLON.Vector3(5, 5, 5);
  model.rotation = new BABYLON.Vector3(0, 0, 0);

  // Создаем физический импостор для героя
  model.physicsImpostor = new BABYLON.PhysicsImpostor(model, BABYLON.PhysicsImpostor.MeshImpostor, {
    mass: 1,
    restitution: 0,
    friction: 0,
    fixedRotation: true,
    inertia: new BABYLON.Vector3(0, 0, 0)
  }, scene);
  meshes.type = 'hero'
  return [meshes, animationGroups];
}

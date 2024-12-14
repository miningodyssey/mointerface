export function createObstacle(scene, x, y, z, modelCache) {
  try {
    const obstacleTop = modelCache[0].clone("clonedSubwayModel");
    obstacleTop.setEnabled(false);
    obstacleTop.scaling = new BABYLON.Vector3(5, 6.4, 9);

    const collisionBox = BABYLON.MeshBuilder.CreateBox(
        "collisionBox",
        { width: 0.5, height: 1.67, depth: 5.8 },
        scene
    );
    collisionBox.rotation.y = Math.PI;
    collisionBox.position = new BABYLON.Vector3(x, y, z);
    collisionBox.isVisible = false;

    collisionBox.physicsImpostor = new BABYLON.PhysicsImpostor(
        collisionBox,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0, friction: 0.5 },
        scene
    );

    obstacleTop.parent = collisionBox;
    collisionBox.type = "wagon";
    collisionBox.isReusable = true;
    return collisionBox;
  } catch (error) {
    console.error("Error creating obstacle: ", error);
    return null;
  }
}

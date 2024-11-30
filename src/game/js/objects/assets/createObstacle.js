export function createObstacle(scene, x, y, z, modelCache) {
  try {
    // Клонируем оригинальный меш
    modelCache.forEach((mesh) => {
      mesh.isReusable = true;
    });
    const obstacleTop = modelCache[0].clone("clonedSubwayModel");

    // Отключаем объект, чтобы он был невидим и неактивен
    obstacleTop.setEnabled(false);

    obstacleTop.scaling = new BABYLON.Vector3(5, 6.4, 9);

    // Создаем коллизионную коробку и настраиваем ее позицию
    const collisionBox = BABYLON.MeshBuilder.CreateBox("collisionBox", { width: 0.5, height: 1.67, depth: 5.8 }, scene);
    collisionBox.rotation.y = Math.PI;
    collisionBox.position = new BABYLON.Vector3(x, y, z);
    collisionBox.isVisible = false;

    const boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Задаем красный цвет (RGB)
    collisionBox.material = boxMaterial;

    // Делаем obstacleTop дочерним элементом collisionBox
    obstacleTop.parent = collisionBox;

    // Устанавливаем физический импостер для коллизионной коробки
    collisionBox.physicsImpostor = new BABYLON.PhysicsImpostor(collisionBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0.5 }, scene);

    collisionBox.physicsImpostor.physicsBody.setActivationState(4);
    collisionBox.physicsImpostor.physicsBody.setCollisionFlags(2);

    // Включаем CCD
    collisionBox.physicsImpostor.physicsBody.setCcdMotionThreshold(0.01);
    collisionBox.physicsImpostor.physicsBody.setCcdSweptSphereRadius(1.6);
    collisionBox.type = 'wagon';
    collisionBox.isReusable = true;
    return collisionBox;
  } catch (error) {
    console.error("Error creating obstacle: ", error);
    return null;
  }
}

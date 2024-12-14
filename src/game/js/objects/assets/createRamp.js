export function createRamp(scene, x, y, z, modelCache) {
  try {
    // Клонируем оригинальный меш рампы
    modelCache.rampModel.forEach((mesh) => {
      mesh.isReusable = true;
    });
    const rampClone = modelCache.rampModel[0].clone("clonedRampModel");

    // Отключаем объект, чтобы он был невидим и неактивен
    rampClone.setEnabled(false);

    // Устанавливаем масштабирование рампы
    rampClone.scaling = new BABYLON.Vector3(7, 5.5, 18);

    // Создаем коллизионную коробку
    const collisionBox = BABYLON.MeshBuilder.CreateBox("rampCollisionBox", {
      width: 0.5,
      height: 3.5 / 3.2, // Подстраиваем под высоту рампы
      depth: 3.27
    }, scene);

    // Устанавливаем позицию и поворот коллизионной коробки
    collisionBox.position = new BABYLON.Vector3(x, y, z);
    collisionBox.rotation.x = -Math.PI / 12; // Поворачиваем коллизионную коробку, как требовалось
    collisionBox.isVisible = false; // Коллизионная коробка невидима

    // Делаем rampClone дочерним элементом коллизионной коробки
    rampClone.parent = collisionBox;

    // Поворачиваем саму рампу относительно родительской коллизионной коробки
    rampClone.rotation = new BABYLON.Vector3(-Math.PI / 24, Math.PI, 0);

    // Устанавливаем физический импостер для коллизионной коробкис 
    collisionBox.physicsImpostor = new BABYLON.PhysicsImpostor(
        collisionBox,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0, friction: 0 },
        scene
    );

    // Возвращаем коллизионную коробку
    collisionBox.type = 'ramp';
    collisionBox.isReusable = true;
    return collisionBox;
  } catch (error) {
    console.error("Error creating ramp: ", error);
    return null;
  }
}

export function createJumpObstacle(scene, x, y, z, modelCache) {
    try {
        // Создаем коллизионную коробку
        const collisionBox = BABYLON.MeshBuilder.CreateBox("collisionBox", { width: 0.5, height: 0.6, depth: 0.4 }, scene);
        collisionBox.position = new BABYLON.Vector3(x, y, z);
        collisionBox.isVisible = false; // Устанавливаем коллизионную коробку невидимой

        // Настраиваем физику для коллизионной коробки
        collisionBox.physicsImpostor = new BABYLON.PhysicsImpostor(collisionBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0.5 }, scene);


        modelCache.forEach(mesh => {
                mesh.isReusable = true
                mesh.visibility = 1
        });

        // Клонируем визуальную модель
        const jumpObstacleTop = modelCache[0].clone("clonedJumpModel");
        jumpObstacleTop.isReusable = true

        jumpObstacleTop.scaling = new BABYLON.Vector3(6, 8, 5);

        // Отключаем визуальную модель до расстановки
        jumpObstacleTop.setEnabled(false);

        // Сдвигаем визуальную модель относительно коллизионной коробки
        jumpObstacleTop.position = new BABYLON.Vector3(0, 0, 0); // Относительное позиционирование
        jumpObstacleTop.parent = collisionBox; // Делаем визуальную модель дочерним элементом коллизионной коробки
        jumpObstacleTop.type = 'jump';




        // Устанавливаем тип
        collisionBox.type = 'jump';
        collisionBox.isReusable = true
        return collisionBox;
    } catch (error) {
        console.error("Ошибка при создании прыжкового препятствия: ", error);
        return null;
    }
}

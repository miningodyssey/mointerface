export function createSlideObstacle(scene, x, y, z,  modelCache) {
    try {
        // Создаем коллизионную коробку
        const collisionBox = BABYLON.MeshBuilder.CreateBox("collisionBox", { width: 0.5, height: 0.6, depth: 0.6 }, scene);
        collisionBox.position = new BABYLON.Vector3(x, y, z);
        collisionBox.isVisible = false; // Устанавливаем коллизионную коробку невидимой

        // Настраиваем физику для коллизионной коробки
        collisionBox.physicsImpostor =   new BABYLON.PhysicsImpostor(collisionBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0.5 }, scene);

        modelCache.forEach(mesh => {
                mesh.visibility = 1
                mesh.isReusable = true
            });

        // Клонируем визуальную модель
        const slideObstacleTop = modelCache[0].clone("clonedSlideModel");
        slideObstacleTop.isReusable = true

        slideObstacleTop.scaling = new BABYLON.Vector3(6, 8, 5);
        // Отключаем визуальную модель до расстановки
        slideObstacleTop.setEnabled(false);

        // Сдвигаем визуальную модель относительно коллизионной коробки
        slideObstacleTop.position = new BABYLON.Vector3(0, -0.5, 0); // Относительное позиционирование
        slideObstacleTop.parent = collisionBox; // Делаем визуальную модель дочерним элементом коллизионной коробки

        collisionBox.isReusable = true
        collisionBox.type = 'slide';

        return collisionBox;
    } catch (error) {
        console.error("Ошибка при создании слайдового препятствия: ", error);
        return null;
    }
}

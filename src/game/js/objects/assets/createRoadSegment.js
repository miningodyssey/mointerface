export function createRoadSegment(scene, x, y, z, roadModel) {
    try {
        roadModel.forEach(mesh => {
            mesh.visibility = 1;
            mesh.isReusable = true
        });

        const roadClone = roadModel[0].clone("clonedRoadSegment");
        roadClone.scaling = new BABYLON.Vector3(6, 6, 12);

        const currentPosition = roadClone.position.clone();
        roadClone.position.set(currentPosition.x, y, currentPosition.z);

        // Создаем коллизионную коробку
        const collisionBox = BABYLON.MeshBuilder.CreateBox("collisionBox", {
            height: 0.1,
            width: 3,
            depth: 4.8
        }, scene);

        // Устанавливаем положение коллизионной коробки
        collisionBox.position.set(currentPosition.x, y, currentPosition.z);

        // Делаем коробку видимой для проверки, потом можно сделать её невидимой
        collisionBox.visibility = 0;

        // Устанавливаем коллизионную коробку как родителя для клонированной модели
        roadClone.addChild(collisionBox);
        collisionBox.isReusable = true
        roadClone.setEnabled(false);
        roadModel.forEach(mesh => {
            mesh.visibility = 0;
        });
        roadClone.type = 'road'
        return roadClone;
    } catch (error) {
        console.error("Error creating road segment: ", error);
        return null;
    }
}

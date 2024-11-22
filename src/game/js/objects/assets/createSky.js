export async function createSky(scene) {
    try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", '././models/sky/', "Sky.glb", scene);

        if (!result.meshes || result.meshes.length === 0) {
            console.error("Модели не найдены в sky.glb");
            return;
        }

        const model = result.meshes[0];
        model.scaling = new BABYLON.Vector3(50, 50, 50);
        model.rotation = new BABYLON.Vector3(0, 0, 0);
        model.position = new BABYLON.Vector3(0, 0, 0)
        result.type = 'sky'
        return model;
    } catch (error) {
        console.error("Ошибка при загрузке модели sky.glb:", error);
    }
}

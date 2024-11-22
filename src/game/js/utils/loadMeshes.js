import { applyMipMappingToModel } from "@/game/js/utils/mipMapping";

export async function loadAllMeshes(scene, wagon, slideObstacle, jumpObstacle, road) {
    const meshNames = [
        { name: 'train', file: `${wagon}.glb`, cacheKey: 'subwayModel' },
        { name: 'coins', file: 'coin.glb', cacheKey: 'coinModel' },
        { name: 'slideObstacles', file: `${slideObstacle}.glb`, cacheKey: 'slideObstacleModel' },
        { name: 'jumpObstacles', file: `${jumpObstacle}.glb`, cacheKey: 'jumpObstacleModel' },
        { name: 'ramps', file: 'ramp.glb', cacheKey: 'rampModel' },
        { name: 'roads', file: `${road}.glb`, cacheKey: 'roadModel' },
        { name: 'sky', file: 'SKY(SPEHE1).glb', cacheKey: 'skyModel' }
    ];

    let modelCache = {
        subwayModel: null,
        rampModel: null,
        coinModel: null,
        jumpObstacleModel: null,
        slideObstacleModel: null,
        roadModel: null,
        skyModel: null
    };

    await Promise.all(meshNames.map(async ({ name, file, cacheKey }) => {
        // Указываем путь с учетом обновленных имен папок
        const folderPath = `/models/${name}/`;
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', folderPath, file, scene);
        modelCache[cacheKey] = meshes.meshes;

        // Применение mipmapping и скрытие мешей
        if (name === 'slideObstacles' || name === 'jumpObstacles') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.visibility = 0;
            });
        } else if (name === 'roads') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.visibility = 0;
            });
        } else if (name === 'ramps' || name === 'sky') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.isEnabled(false);
            });
        } else if (name === 'coins') {
            applyMipMappingToModel(modelCache[cacheKey][0]);
            let meshToHide = scene.getMeshByName("Cylinder004");
            if (meshToHide) {
                meshToHide.visibility = 0;
            }
        } else if (name === 'wagons') {
            let meshToHide = scene.getMeshByName("default.008");
            if (meshToHide) {
                meshToHide.visibility = 0;
            }
        }
    }));

    return modelCache;
}

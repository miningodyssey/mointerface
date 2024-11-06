import {applyMipMappingToModel} from "@/game/js/utils/mipMapping";

export async function loadAllMeshes(scene) {
    const meshNames = [
        { name: 'bigObstacle', file: 'train.glb', cacheKey: 'subwayModel' },
        { name: 'coin', file: 'coin.glb', cacheKey: 'coinModel' },
        { name: 'slideObstacle', file: 'slideObstacle.glb', cacheKey: 'slideObstacleModel' },
        { name: 'jumpObstacle', file: 'jumpObstacle.glb', cacheKey: 'jumpObstacleModel' },
        { name: 'ramp', file: 'ramp.glb', cacheKey: 'rampModel' },
        { name: 'road', file: 'road.glb', cacheKey: 'roadModel' },
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
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', file, scene);
        modelCache[cacheKey] = meshes.meshes;

        // Применение mipmapping и скрытие мешей
        if (name === 'slideObstacle' || name === 'jumpObstacle') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.visibility = 0;
            });
        } else if (name === 'road') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.visibility = 0;
            });
        } else if (name === 'ramp' || name === 'sky') {
            modelCache[cacheKey].forEach(mesh => {
                applyMipMappingToModel(mesh);
                mesh.isEnabled(false);
            });
        } else if (name === 'coin') {
            applyMipMappingToModel(modelCache[cacheKey][0]);
            let meshToHide = scene.getMeshByName("Cylinder004");
            if (meshToHide) {
                meshToHide.visibility = 0;
            }
        } else if (name === 'bigObstacle') {
            let meshToHide = scene.getMeshByName("default.008");
            if (meshToHide) {
                meshToHide.visibility = 0;
            }
        }
    }));

    return modelCache;
}

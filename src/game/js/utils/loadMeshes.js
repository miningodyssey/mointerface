import {applyMipMappingToModel} from "./mipMapping.js";
export async function loadMeshes (meshName, scene, modelCache) {
    if (meshName === 'bigObstacle') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'train.glb', scene);
        // Сохраняем меши в кэш
        modelCache.subwayModel = meshes.meshes;
        let meshToHide = scene.getMeshByName("default.008");
        if (meshToHide) {
            meshToHide.visibility = 0
        }
    }
    if (meshName === 'slideObstacle') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'slideObstacle.glb', scene);
        modelCache.slideObstacleModel = meshes.meshes;
        applyMipMappingToModel(modelCache.slideObstacleModel[0])
        applyMipMappingToModel(modelCache.slideObstacleModel[1])
        applyMipMappingToModel(modelCache.slideObstacleModel[2])
        applyMipMappingToModel(modelCache.slideObstacleModel[3])


        modelCache.slideObstacleModel.forEach((mesh) => {
            mesh.visibility = 0;
        })
    }

    if (meshName === 'jumpObstacle') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'jumpObstacle.glb', scene);
        modelCache.jumpObstacleModel = meshes.meshes;
        applyMipMappingToModel(modelCache.jumpObstacleModel[0])
        applyMipMappingToModel(modelCache.jumpObstacleModel[1])
        applyMipMappingToModel(modelCache.jumpObstacleModel[2])
        applyMipMappingToModel(modelCache.jumpObstacleModel[3])

        modelCache.jumpObstacleModel.forEach((mesh) => {
            mesh.visibility = 0;
        })
    }
    if (meshName === 'coin') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'coin.glb', scene);
        modelCache.coinModel = meshes.meshes;
        applyMipMappingToModel(modelCache.coinModel[0])
        let meshToHide = scene.getMeshByName("Cylinder004");
        if (meshToHide) {
            meshToHide.visibility = 0
        }
    }
    if (meshName === 'road') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'road.glb', scene);
        modelCache.roadModel = meshes.meshes;

        modelCache.roadModel.forEach(mesh => {
            applyMipMappingToModel(mesh);
            mesh.visibility = 0;
        });
    }
    if (meshName === 'ramp') {
        /*
                const rampWidth = 0.5;
                const rampHeight = 1.67 / 3;
                const rampDepth = 3.27;
                const ramp = BABYLON.MeshBuilder.CreateBox("ramp", { width: rampWidth, height: rampHeight, depth: rampDepth }, scene);
                ramp.rotation.x = -Math.PI / 12;
                ramp.material = new BABYLON.StandardMaterial("rampMat", scene);
                ramp.material.diffuseColor = new BABYLON.Color3(0.8, 0.5, 0.2);
        */
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'ramp.glb', scene);
        modelCache.rampModel = meshes.meshes
        meshes.meshes.forEach((mesh) => {
            applyMipMappingToModel(mesh)
        })
        modelCache.rampModel[0].isEnabled(false)
    }
    if (meshName === 'sky') {
        const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'SKY(SPEHE1).glb', scene);
        modelCache.skyModel = meshes.meshes
        meshes.meshes.forEach((mesh) => {
            applyMipMappingToModel(mesh)
        })
        modelCache.skyModel[0].isEnabled(false)
    }
}

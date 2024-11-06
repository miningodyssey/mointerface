export function updateTextureWithMipMapping(texture) {
    texture.generateMipMaps = true;
    texture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
}

// Примените эту функцию ко всем текстурам в модели
export function applyMipMappingToModel(model) {
    model.getChildMeshes().forEach(mesh => {
        if (mesh.material && mesh.material.diffuseTexture) {
            updateTextureWithMipMapping(mesh.material.diffuseTexture);
        }
        if (mesh.material && mesh.material.emissiveTexture) {
            updateTextureWithMipMapping(mesh.material.emissiveTexture);
        }
        // Добавьте другие типы текстур, если они используются
    });
}
export function setupRenderingPipeline(engine, scene, camera, settings) {
    const { graphicsQuality, antiAliasingEnabled, textureResolution } = settings;

    // Масштабирование
    const scale = Math.max(0.5, 1 - graphicsQuality / 150);
    engine.setHardwareScalingLevel(scale);

    const defaultPipeline = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline",
        true,
        scene,
        [camera]
    );

    defaultPipeline.fxaaEnabled = antiAliasingEnabled;
    if (graphicsQuality > 75 && engine.getCaps().webgl2) {
        defaultPipeline.samples = 4; // MSAA 4x
    } else {
        defaultPipeline.samples = 1;
    }

    // Настройки тонального отображения
    defaultPipeline.imageProcessing.toneMappingEnabled = true;
    defaultPipeline.imageProcessing.toneMappingType =
        graphicsQuality > 75
            ? BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES
            : BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD;
    defaultPipeline.imageProcessing.exposure = 1.0 + (graphicsQuality - 50) / 100;

    // Настройка bloom
    if (graphicsQuality < 30) {
        defaultPipeline.bloomEnabled = false;
    } else {
        defaultPipeline.bloomEnabled = true;
        defaultPipeline.bloomThreshold = 0.9 - graphicsQuality / 100;
        defaultPipeline.bloomScale = graphicsQuality / 100;
        defaultPipeline.bloomKernel = graphicsQuality > 75 ? 128 : 64;
    }

    // Уменьшение разрешения текстур
    scene.textures.forEach((texture) => {
        if (texture.updateSamplingMode) {
            texture.updateSamplingMode(BABYLON.Texture.BILINEAR_SAMPLINGMODE);
        }
        if (graphicsQuality < 50 && texture.isReady()) {
            texture.scaleTo(texture.getBaseSize().width / 2, texture.getBaseSize().height / 2);
        }
    });

    // Отключение дополнительных эффектов при низком качестве
    if (graphicsQuality < 50) {
        scene.shadowsEnabled = false;
        scene.fogEnabled = false;
        scene.particlesEnabled = false;
    }

}

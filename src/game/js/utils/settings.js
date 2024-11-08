import * as BABYLON from "babylonjs";

export function setupRenderingPipeline(engine, scene, camera, settings) {
    const { graphicsQuality, antiAliasingEnabled, textureResolution } = settings;

    // Настроим масштабирование в зависимости от качества графики
    engine.setHardwareScalingLevel(1 - graphicsQuality / 100);

    const defaultPipeline = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline",
        true,
        scene,
        [camera]
    );

    // Настройка анти-алиасинга
    defaultPipeline.fxaaEnabled = antiAliasingEnabled;

    // Настройка разрешения текстур
    scene.texturesEnabled = true;
    scene.textureQuality = textureResolution;

    // Дополнительные параметры для пост-обработки
    defaultPipeline.bloomEnabled = graphicsQuality > 50;
    defaultPipeline.bloomThreshold = 0.01 * (100 - graphicsQuality);
    defaultPipeline.bloomScale = 0.5 * (graphicsQuality / 100);
    defaultPipeline.bloomWeight = 0.3;
    defaultPipeline.bloomKernel = graphicsQuality > 75 ? 128 : 32;
}
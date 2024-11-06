import * as BABYLON from "babylonjs";

export function setupMobileRenderingPipeline(engine, scene, camera) {
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", false, scene, [camera]);
    engine.setHardwareScalingLevel(0.5);
    defaultPipeline.bloomEnabled = false;
    defaultPipeline.fxaaEnabled = false;
    defaultPipeline.bloomThreshold = 0.0125;
    defaultPipeline.bloomScale = 0.1;
    defaultPipeline.bloomWeight = 0.1;
    defaultPipeline.bloomKernel = 8;
}

export function setupDesktopRenderingPipeline(engine, scene, camera) {
    const defaultPipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
    engine.setHardwareScalingLevel(1);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.bloomThreshold = 0.001;
    defaultPipeline.bloomScale = 0.7;
    defaultPipeline.bloomWeight = 0.7;
    defaultPipeline.bloomKernel = 128;
}

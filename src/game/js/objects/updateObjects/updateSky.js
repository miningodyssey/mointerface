
export function updateSky(model, dt) {
    model.rotate(BABYLON.Axis.X, 0.02 * dt, BABYLON.Space.LOCAL);

}

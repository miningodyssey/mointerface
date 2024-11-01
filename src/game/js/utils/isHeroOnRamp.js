import BABYLON from "babylonjs";

export function isHeroOnRamp(hero, ramp, engine, isJumping) {
    const dt = engine.getDeltaTime() / 1000;
    const heroPos = hero.getAbsolutePosition();
    const rampPos = ramp.getAbsolutePosition();

    const earlyOffset = 0;
    const lateOffset = 1.5;

    const rampLength = 3.2;
    const rampStartZ = rampPos.z;
    const rampEndZ = rampPos.z - rampLength;

    const heroX = Math.round(heroPos.x * 10) / 10;
    const rampX = Math.round(rampPos.x * 10) / 10;
    const isOnRamp =
        Math.abs(heroX - rampX) === 0 &&
        heroPos.z <= rampStartZ + lateOffset &&
        heroPos.z >= rampEndZ - earlyOffset &&
        ramp.type === 'ramp';

    if (isOnRamp) {
        if (!isJumping) {
            // Сброс вертикальной скорости
            hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0), hero.getAbsolutePosition()); // Negative impulse downwards
            hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

            // Снижение вертикальной позиции, чтобы предотвратить подлет
            if (hero.position.y > 1.8) {
                hero.position.y = Math.max(hero.position.y - (0.1 * dt), 1.8);
            }
        }
        return true;
    }
    return false;
}
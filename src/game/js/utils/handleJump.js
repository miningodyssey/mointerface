import * as BABYLON from "babylonjs";

export function handleJump(hero, create) {
        create[1].forEach(animation => {
            if (animation.name !== 'RUN') {
                animation.stop();
            }
        });
        hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 4, 0));
        create[1][1].start();
        return false

}
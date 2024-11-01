import {isHeroOnRamp} from "./isHeroOnRamp";
import BABYLON from "babylonjs";

function handleObstacleCollision(hero, obstacle, dt) {
    if (isHeroOnTopOfObstacle(hero, obstacle)) {
        if (isHeroOnRamp(hero, obstacle, engine)) {
            hero.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            return
        }
        if ((obstacle.type === 'wagon' || obstacle.type === 'ramp')) {
            if (!isJumping && isGrounded && (1.5 < hero.position.y && hero.position.y < 1.8)) {
                hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
                hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
            }
            return;
        }
    }

    if (isHeroCollidingWithObstacle(hero, obstacle, dt)) {

        if (obstacle.type === 'jump') {
            if (!isJumping) {
                endGame();
            }
        } else if (obstacle.type === 'slide') {
            if (!isSliding) {
                endGame();
            }
        } else if (obstacle.type === 'wagon') {
            hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
            hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

            endGame();
        } else {
            hero.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
            hero.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
            hero.position.copyFrom(hero.position);
        }
    }
}
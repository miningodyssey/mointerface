import {gameOver} from "./gameOver";
import {updateTopAfterRun} from "@/components/functions/updateTopAfterRun";

export function endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, engine, hero, setIsModalOpen, endMenu, pauseButton, userData, setUserData, score, record, renderLoop) {
    gameOver(gamePaused, rollingSpeed);
    setIsModalOpen(true);
    endMenu.style.display = 'block';
    pauseButton.style.display = 'none';
    const animationGroup = create[1][5];
    if ("vibrate" in navigator) {
        navigator.vibrate(2); // Вибрация на 200 мс
    }

    if (!hasAnimationEnded) {
        hasAnimationEnded = true
        animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
        animationGroup.onAnimationGroupEndObservable.addOnce(() => {
            const lastFrame = animationGroup.to;
            animationGroup.goToFrame(lastFrame);
            scene.stopAnimation(hero);
            engine.stopRenderLoop(renderLoop);
        });
    }
    create[1][0].stop();
    scene.unregisterBeforeRender(updateGame);


}

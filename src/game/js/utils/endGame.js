import {gameOver} from "./gameOver";
import {updateTopAfterRun} from "@/components/functions/updateTopAfterRun";

export function endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton, userData, setUserData, score, record) {
    gameOver(gamePaused, rollingSpeed);
    setIsModalOpen(true);
    endMenu.style.display = 'block';
    pauseButton.style.display = 'none';
    const animationGroup = create[1][4];
    if (!hasAnimationEnded) {
        hasAnimationEnded = true
        animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
        animationGroup.onAnimationGroupEndObservable.addOnce(() => {
            const lastFrame = animationGroup.to;
            animationGroup.goToFrame(lastFrame);
            scene.stopAnimation(hero);
        });
    }
    create[1][0].stop();
    scene.unregisterBeforeRender(updateGame);

    if (score > 0) {
        updateTopAfterRun(userData.id, score, record).then(updatedUserData => {
            setUserData(updatedUserData);
        }).catch(error => {
            console.error("Ошибка при обновлении данных:", error);
        });
    }
}

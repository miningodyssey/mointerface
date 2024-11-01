import {gameOver} from "./gameOver";

export function endGame(gameEnded, gamePaused, rollingSpeed, updateGame, create, hasAnimationEnded, scene, hero, setIsModalOpen, endMenu, pauseButton) {
    // Остановить все игровые действия
    gameOver(gamePaused, rollingSpeed);
    gameEnded  = true; // Флаг окончания игры
    scene.unregisterBeforeRender(updateGame);
    setIsModalOpen(true);
    endMenu.style.display = 'block'
    pauseButton.style.display = 'none'
    // Получаем группу анимаций
    const animationGroup = create[1][4];
    create[1][0].dispose();
    // Если анимация еще не закончена
    if (!hasAnimationEnded) {
        // Установить флаг, что анимация началась
        hasAnimationEnded = true;

        // Остановить все анимации героя перед запуском новой
        scene.stopAnimation(hero);

        // Запустить анимацию (без зацикливания)
        animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);

        // Обработчик завершения анимации
        animationGroup.onAnimationGroupEndObservable.addOnce(() => {
            const lastFrame = animationGroup.to; // Получаем последний кадр анимации
            animationGroup.goToFrame(lastFrame); // Устанавливаем на последний кадр

            // Если игра закончена, остановите анимацию героя
            scene.stopAnimation(hero); // Остановите анимацию героя
        });
    }
}
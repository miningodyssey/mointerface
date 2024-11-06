import {stopGame} from "@/game/js/utils/stopGame";

export function gameOver(gamePaused, rollingSpeed) {
    stopGame(gamePaused, rollingSpeed);  // Pause the game
}
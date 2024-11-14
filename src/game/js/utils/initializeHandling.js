import {handleJump} from "./handleJump";

export function handleKeyDown(event, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, startSlide) {
    if (rollingSpeed === 0) return;
    if (event.keyCode === 37) { // Left arrow
        if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
            create[1].forEach((animation) => {
                if (animation.name !== 'RUN') {
                    animation.stop();
                }
            });
            currentLane -= 0.5;
            create[1][1].start();
        }
    } else if (event.keyCode === 39) { // Right arrow
        if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
            create[1].forEach((animation) => {
                if (animation.name !== 'RUN') {
                    animation.stop();
                }
            });
            currentLane += 0.5;
            create[1][2].start();
        }
    } else if (event.keyCode === 38) { // Up arrow (jump)
        if (isGrounded && (((Date.now() - lastJumpTime) >= jumpCooldown * 1000))) {
            lastJumpTime = Date.now()
            isGrounded = handleJump(hero, create);
        }
    } else if (event.keyCode === 40) { // Down arrow (slide)
        startSlide();
    }
    return {
        currentLane,
        lastJumpTime,
        isGrounded
    }
}


export function handlePointerDown(event, startX, startY) {
    startX = event.clientX;
    startY = event.clientY;
    return {startX, startY}
}

export function handlePointerMove(event, startX, startY, endX, endY) {
    if (startX !== undefined && startY !== undefined) {
        endX = event.clientX;
        endY = event.clientY;
        return {endX, endY}
    }
}

export function handlePointerUp(startX, startY, endX, endY, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, startSlide, previousLane) {
    if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
            handleSwipe(deltaX, deltaY, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, startSlide, previousLane);
        }
        startX = startY = endX = endY = undefined;

        return { deltaX, deltaY }
    }
}

export function removeAllEventListeners(canvas, onKeyDown, onPointerDown, onPointerUp, onPointerMove) {
    window.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
}

export function handleSwipe(deltaX, deltaY, rollingSpeed, create, currentLane, leftLane, rightLane, isGrounded, lastJumpTime, jumpCooldown, isLaneBlocked, hero, startSlide, previousLane) {
    previousLane = currentLane;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            if (currentLane !== rightLane && !isLaneBlocked(currentLane + 0.5)) {
                create[1].forEach((animation) => {
                    if (animation.name !== 'RUN') {
                        animation.stop();
                    }
                });
                currentLane += 0.5;
                create[1][2].start();
            }
        } else {
            if (currentLane !== leftLane && !isLaneBlocked(currentLane - 0.5)) {
                create[1].forEach((animation) => {
                    if (animation.name !== 'RUN') {
                        animation.stop();
                    }
                });
                currentLane -= 0.5;
                create[1][1].start();
            }
        }
    } else {
        if (deltaY < 0) {
            if (isGrounded && (((Date.now() - lastJumpTime) >= jumpCooldown * 1000))) {
                lastJumpTime = Date.now();
                isGrounded = handleJump(hero, create);
            }
        } else if (deltaY > 0) {
            startSlide()
        }
    }
    return {
        currentLane,
        previousLane,
        lastJumpTime,
        isGrounded
    }
}

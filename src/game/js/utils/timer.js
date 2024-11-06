export function createTimer (type) {
  let duration = 0;
  let elapsed = 0;
  let isActive = false;
  let lastFrameTime = Date.now();
  let onTick = () => {};
  let onCompleted = () => {};

  function getTimeLeft() {
    const difference = duration - elapsed;
    return Math.max(0, difference);
  }

  function pause() {
    isActive = false;
  }

  function reset() {
    elapsed = 0;
  }

  function setDuration(seconds) {
    lastFrameTime = Date.now();
    duration = seconds;
  }

  function start() {
    isActive = true;
    tick();
  }

  function stop() {
    pause();
    reset();
  }

  function tick() {
    const currentFrameTime = Date.now();
    const deltaTime = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    if (isActive) {
      elapsed += deltaTime / 1000;
      onTick(getTimeLeft());
      window.requestAnimationFrame(tick);
    }
  }

  function tickCountdown() {
    const currentFrameTime = Date.now();
    const deltaTime = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    if (isActive) {
      elapsed += deltaTime / 1000;
      onTick(getTimeLeft());

      if (getTimeLeft() <= 0) {
        pause();
        onCompleted();
      } else {
        window.requestAnimationFrame(tickCountdown);
      }
    }
  }

  // Initialization based on type
  switch (type) {
    case "countDown":
      return {
        getTimeLeft,
        pause,
        reset,
        setDuration,
        start,
        stop,
        onTick: (callback) => { onTick = callback; },
        onCompleted: (callback) => { onCompleted = callback; },
        isActive: () => isActive,
        tick: tickCountdown  // For countdown timer
      };
    case "timer":
    default:
      return {
        getTimeLeft,
        pause,
        reset,
        setDuration,
        start,
        stop,
        onTick: (callback) => { onTick = callback; },
        onCompleted: (callback) => { onCompleted = callback; },
        isActive: () => isActive,
        tick  // For regular timer
      };
  }
}

function throttle(mainFunction, delay) {
  let timerFlag = null;

  return () => {
    if (timerFlag === null) {
      mainFunction();
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}


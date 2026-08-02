// timer.js — requestAnimationFrame ile akıcı geri sayım.

const Timer = (() => {
  let raf = null;
  let endAt = 0;
  let total = 1;
  let handlers = {};
  let lastWhole = null;

  function loop() {
    const remain = Math.max(0, (endAt - performance.now()) / 1000);
    if (handlers.onTick) handlers.onTick(remain, remain / total);

    const whole = Math.ceil(remain);
    if (whole !== lastWhole) {
      lastWhole = whole;
      if (handlers.onWarn && whole > 0 && whole <= 3) handlers.onWarn(whole);
    }

    if (remain <= 0) {
      stop();
      if (handlers.onExpire) handlers.onExpire();
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function start(seconds, h) {
    stop();
    total = seconds;
    endAt = performance.now() + seconds * 1000;
    handlers = h || {};
    lastWhole = null;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  }

  return { start, stop };
})();

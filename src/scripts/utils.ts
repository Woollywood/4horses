export function linear(timeFraction: number) {
  return timeFraction;
}

export function quad(timeFraction: number) {
  return Math.pow(timeFraction, 2);
}

export function circ(timeFraction: number) {
  return 1 - Math.sin(Math.acos(timeFraction));
}

type AnimateParams = {
  timing: (fraction: number) => number;
  draw: (progress: number) => void;
  duration: number;
};

export function animate({ timing, draw, duration }: AnimateParams) {
  let start = performance.now();

  requestAnimationFrame(function animateFrame(time: number) {
    let timeFraction = (time - start) / duration;
    if (timeFraction >= 1) {
      timeFraction = 1;
    }

    let progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animateFrame);
    }
  });
}

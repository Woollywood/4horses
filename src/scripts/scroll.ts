import { animate, circ } from "./utils";

export function observerInit() {
  enum AnimationDirection {
    FROM_LEFT = "from-left",
    FROM_RIGHT = "from-right",
  }

  const elements = document.querySelectorAll("[data-animation]");
  if (!elements.length) return;

  elements.forEach((element) => {
    (element as HTMLElement).style.cssText = `
		  opacity: 0;
	  `;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const direction = target.dataset.animation as AnimationDirection;

          switch (direction) {
            case AnimationDirection.FROM_LEFT:
              target.style.cssText += "transform: translateX(-100%)";
              break;
            case AnimationDirection.FROM_RIGHT:
              target.style.cssText += "transform: translateX(100%)";
              break;
            default:
              throw new Error("unhandler direction");
          }

          animate({
            duration: 666,
            timing: circ,
            draw: (progress) => {
              target.style.cssText = `opacity: ${progress * 100}`;

              switch (direction) {
                case AnimationDirection.FROM_LEFT:
                  target.style.cssText += `transform: translateX(-${100 - progress * 100}%)`;
                  break;
                case AnimationDirection.FROM_RIGHT:
                  target.style.cssText += `transform: translateX(${100 - progress * 100}%)`;
                  break;
              }
            },
          });

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 1,
      rootMargin: `-${window.innerHeight * 0.1}px`,
    },
  );

  elements.forEach((element) => observer.observe(element));
}

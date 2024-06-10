import "./assets/styles/tailwind.css";
import "./assets/styles/common.css";
import "./assets/styles/animation.css";

type SliderOptions = {
  slidesPerView: number;
  spaceBetween: number;
  navigation: {
    buttonPrev: HTMLElement;
    buttonNext: HTMLElement;
  };
  pagination: HTMLElement;
  breakPoints?: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween: number;
    };
  };
};

function linear(timeFraction: number) {
  return timeFraction;
}

function quad(timeFraction: number) {
  return Math.pow(timeFraction, 2);
}

function circ(timeFraction: number) {
  return 1 - Math.sin(Math.acos(timeFraction));
}

type AnimateParams = {
  timing: (fraction: number) => number;
  draw: (progress: number) => void;
  duration: number;
};

function animate({ timing, draw, duration }: AnimateParams) {
  let start = performance.now();
  const animateStartEvent = new Event("animate:start");
  const animateEndEvent = new Event("animate:end");

  document.dispatchEvent(animateStartEvent);
  requestAnimationFrame(function animateFrame(time: number) {
    let timeFraction = (time - start) / duration;
    if (timeFraction >= 1) {
      document.dispatchEvent(animateEndEvent);
      timeFraction = 1;
    }

    let progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animateFrame);
    }
  });
}

class Slider {
  private sliderElement: Element | null = null;
  private slides: HTMLCollection | null | undefined = null;
  private navigation: {
    buttonPrev: HTMLElement;
    buttonNext: HTMLElement;
  } | null = null;
  private pagination: HTMLElement | null = null;
  private sliderOptions: SliderOptions | null = null;

  private slideIndex: number = 0;
  private slidesCount: number = 0;
  private sliderWidth: number = 0;

  private isLocked: boolean = false;

  constructor(sliderEl: Element | null, options: SliderOptions) {
    this.sliderElement = sliderEl;
    options ? (this.sliderOptions = options) : null;

    this.slides = this.sliderElement?.children;
    Array.from(this.slides!).forEach((slide, index) => {
      (slide as HTMLElement).dataset.slideIndex = `${index}`;
    });

    this._slidesStyleWrite();

    this.navigation = options.navigation;

    this.pagination = options.pagination;
    this.slidesCount = this.slides?.length!;

    this.pagination.insertAdjacentHTML(
      "afterbegin",
      `<span class="text-foreground" data-pagination-current>${this.slideIndex + 1}</span>
	  		<span class="text-foreground/60">/</span>
		<span class="text-foreground/60">${this.slidesCount}</span>`,
    );

    this._resizer();
    this._navigation();
  }

  _animate({ timing, draw, duration }: AnimateParams) {
    document.addEventListener(
      "animate:start",
      () => (this.isLocked = true),

      { once: true },
    );

    animate({ timing, draw, duration });

    document.addEventListener("animate:end", () => (this.isLocked = false), {
      once: true,
    });
  }

  _track(slideIndex: number) {
    this.slideIndex = slideIndex;

    document.addEventListener(
      "animate:end",
      () => {
        if (
          this.slideIndex >
          this.slidesCount - this.sliderOptions?.slidesPerView!
        ) {
          const { spaceBetween } = this.sliderOptions!;
          const sliderOffset = this.sliderWidth + spaceBetween;

          console.log("eqw");
        }
      },
      {
        once: true,
      },
    );
  }

  _slideTo(sliderIndex: number) {
    const currentIndex = this.slideIndex;
    this.slideIndex = sliderIndex;
  }

  _navigation() {
    const { buttonPrev, buttonNext } = this.navigation!;

    buttonPrev.addEventListener("click", () => {
      if (this.slideIndex > 0 && !this.isLocked) {
        this._track(this.slideIndex - 1);

        const paginationCurrent = this.sliderOptions?.pagination.querySelector(
          "[data-pagination-current]",
        );

        if (paginationCurrent)
          paginationCurrent.innerHTML = `${this.slideIndex + 1}`;

        this._animate({
          duration: 1000,
          timing: quad,
          draw: (progress) => {
            const { spaceBetween } = this.sliderOptions!;
            progress = 1 - progress;
            const offset =
              this.sliderWidth * this.slideIndex +
              spaceBetween * this.slideIndex +
              (this.sliderWidth + spaceBetween) * progress;
            (this.sliderElement as HTMLElement).dataset.offset = `${offset}`;

            (this.sliderElement as HTMLElement).style.transform =
              `translateX(-${offset}px)`;
          },
        });
      }
    });

    buttonNext.addEventListener("click", () => {
      if (
        this.slideIndex <
          this.slidesCount - this.sliderOptions?.slidesPerView! &&
        !this.isLocked
      ) {
        this._track(this.slideIndex + 1);

        const paginationCurrent = this.sliderOptions?.pagination.querySelector(
          "[data-pagination-current]",
        );

        if (paginationCurrent)
          paginationCurrent.innerHTML = `${this.slideIndex + 1}`;

        this._animate({
          duration: 1000,
          timing: quad,
          draw: (progress) => {
            const { spaceBetween } = this.sliderOptions!;
            const offset =
              this.sliderWidth * (this.slideIndex - 1) +
              spaceBetween * (this.slideIndex - 1) +
              (this.sliderWidth + spaceBetween) * progress;
            (this.sliderElement as HTMLElement).dataset.offset = `${-offset}`;

            (this.sliderElement as HTMLElement).style.transform =
              `translateX(-${offset}px)`;
          },
        });
      } else {
        this._track(0);
      }
    });
  }

  _slidesStyleWrite() {
    const { spaceBetween, slidesPerView } = this.sliderOptions!;
    this.sliderWidth =
      ((this.sliderElement as HTMLElement).offsetWidth -
        spaceBetween * (slidesPerView - 1)) /
      slidesPerView;

    (this.sliderElement as HTMLElement).style.cssText +=
      `--slide-width: ${((this.sliderElement as HTMLElement).offsetWidth - spaceBetween * (slidesPerView - 1)) / slidesPerView}px`;

    Array.from(this.slides!).forEach((el, index) => {
      const element = el as HTMLElement;
      element.style.width = `${((this.sliderElement as HTMLElement).offsetWidth - spaceBetween * (slidesPerView - 1)) / slidesPerView}px`;
      index !== this.slides?.length! - 1
        ? (element.style.marginRight = `${spaceBetween}px`)
        : null;
    });
  }

  _resizer() {
    window.addEventListener("resize", () => this._slidesStyleWrite());
  }
}

function setupRunningField() {
  Array.from(document.querySelectorAll("[data-running-field]")).forEach(
    (field) => {
      (field as HTMLElement).style.width = `${Array.from(field.children).reduce(
        (result, child) => (result += (child as HTMLElement).offsetWidth),
        0,
      )}px`;

      const childrenCount = field.children.length;

      for (let i = 0; i < childrenCount; i++) {
        field.insertAdjacentElement(
          "beforeend",
          field.children[i].cloneNode(true) as Element,
        );
      }
    },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  new Slider(document.querySelector("[data-slider]"), {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      buttonNext: document.querySelector("[data-slider-next]")!,
      buttonPrev: document.querySelector("[data-slider-prev]")!,
    },
    pagination: document.querySelector("[data-slider-pagination]")!,
  });

  setupRunningField();
  observerInit();
});

function observerInit() {
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

import "./assets/styles/tailwind.css";
import "./assets/styles/common.css";
import "./assets/styles/animation.css";

import "./assets/styles/slider.css";

import { observerInit } from "./scripts/scroll";
import { Slider, SliderOptions } from "./scripts/slider";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider--members").forEach((slider) => {
    const baseOptions = {
      loop: true,
      autoplay: {
        delay: 6000,
      },
      speed: 300,
      breakpoints: {
        320: {
          spaceBetween: 16,
          slidesPerView: 1,
        },
        568: {
          spaceBetween: 16,
          slidesPerView: 2,
        },
        1024: {
          spaceBetween: 20,
          slidesPerView: 3,
        },
      },
    };

    if (slider.classList.contains("desktop")) {
      new Slider(
        slider as HTMLElement,
        Object.assign({}, baseOptions, {
          navigation: {
            buttonNext: document.querySelector(
              ".slider-members-button--next.desktop",
            )! as HTMLElement,
            buttonPrev: document.querySelector(
              ".slider-members-button--prev.desktop",
            )! as HTMLElement,
          },
          pagination: {
            el: document.querySelector(
              ".slider-members-pagination.desktop",
            )! as HTMLElement,
            type: "fraction",
          },
        }) as SliderOptions,
      );
    } else {
      new Slider(
        slider as HTMLElement,
        Object.assign({}, baseOptions, {
          navigation: {
            buttonNext: document.querySelector(
              ".slider-members-button--next.mobile",
            )! as HTMLElement,
            buttonPrev: document.querySelector(
              ".slider-members-button--prev.mobile",
            )! as HTMLElement,
          },
          pagination: {
            el: document.querySelector(
              ".slider-members-pagination.mobile",
            )! as HTMLElement,
            type: "fraction",
          },
        }) as SliderOptions,
      );
    }
  });

  new Slider(document.querySelector(".slider--stages.mobile")!, {
    speed: 300,
    slidesPerView: 1,
    navigation: {
      buttonNext: document.querySelector(
        ".slider-stages-button--next.mobile",
      )! as HTMLElement,
      buttonPrev: document.querySelector(
        ".slider-stages-button--prev.mobile",
      )! as HTMLElement,
    },
    pagination: {
      el: document.querySelector(
        ".slider-stages-pagination.mobile",
      )! as HTMLElement,
      type: "normal",
    },
  });

  observerInit();
});

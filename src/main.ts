import "./assets/styles/tailwind.css";
import "./assets/styles/common.css";
import "./assets/styles/animation.css";

import "./assets/styles/slider.css";

import { setupRunningField } from "./scripts/animation";
import { observerInit } from "./scripts/scroll";
import { Slider } from "./scripts/slider";

document.addEventListener("DOMContentLoaded", () => {
  const sliderElement = document.querySelector("[data-slider]");

  new Slider(sliderElement as HTMLElement, {
    spaceBetween: 20,
    slidesPerView: 3,
    navigation: {
      buttonNext: document.querySelector(
        ".member-navigation[data-navigation-next]",
      )!,
      buttonPrev: document.querySelector(
        ".member-navigation[data-navigation-prev]",
      )!,
    },
  });

  setupRunningField();
  observerInit();
});

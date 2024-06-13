import type { SliderOptions } from "./interface";

export function initialOptions(): SliderOptions {
  return {
    loop: false,
    spaceBetween: 20,
    slidesPerView: 3,
  };
}

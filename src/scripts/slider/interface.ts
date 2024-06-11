export interface SliderBaseOptions {
  slidesPerView: number;
  spaceBetween: number;
}

export interface SliderOptions extends SliderBaseOptions {
  navigation?: {
    buttonPrev: HTMLElement;
    buttonNext: HTMLElement;
  };
  pagination?: HTMLElement;
  breakPoints?: {
    [key: number]: Partial<SliderBaseOptions>;
  };
}

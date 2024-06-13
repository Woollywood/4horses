export interface SliderBox {
  sliderWidth: number;
  totalSpacingWidth: number;
  totalSlideWidth: number;
}

export interface SliderBaseOptions {
  slidesPerView?: number;
  spaceBetween?: number;
}

export interface SliderOptions extends SliderBaseOptions {
  loop?: boolean;
  speed?: number;
  autoplay?: {
    delay: number;
  };
  navigation?: {
    buttonPrev: HTMLElement;
    buttonNext: HTMLElement;
  };
  pagination?: HTMLElement;
  breakpoints?: {
    [key: number]: Partial<SliderBaseOptions>;
  };
}

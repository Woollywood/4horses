export interface PaginationBullets {
  bullets: HTMLElement[];
}

export interface PaginationFractions {
  fraction: {
    wrapper: HTMLElement;
    currentElement: HTMLElement;
    maxElement: HTMLElement;
  };
}

export type PaginationType = "normal" | "fraction";

export type Pagination = {
  el: HTMLElement;
  type: PaginationType;
} & Partial<PaginationBullets> &
  Partial<PaginationFractions>;

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
  pagination?:
    | HTMLElement
    | {
        el: HTMLElement;
        type: PaginationType;
      };
  breakpoints?: {
    [key: number]: Partial<SliderBaseOptions>;
  };
}

import { type SliderOptions } from "./interface";

export class Slider {
  private _sliderElement: HTMLElement | null = null;
  private _sliderElementWrapper: HTMLElement | null = null;
  private _slides: HTMLCollection | null = null;
  private _options: SliderOptions | null | undefined = null;

  constructor(sliderElem: HTMLElement, options?: SliderOptions) {
    this._init(sliderElem, options);

    console.log(this);
  }

  /**
   *
   * Первичные настройки и присваивания
   *
   * @param sliderElem
   * @param options
   */
  private _init(sliderElem: HTMLElement, options?: SliderOptions) {
    this._sliderElement = sliderElem;
    this._sliderElementWrapper =
      this._sliderElement.querySelector(".slider-wrapper")!;
    this._slides = this._sliderElementWrapper?.children;
    this._options = options;

    this._buildSlides();
  }

  /**
   * Настройки стилей для слайдеров
   */
  private _buildSlides() {
    const { slidesPerView, spaceBetween } = this._options!;

    const sliderWidth = this._sliderElement?.clientWidth!;
    const totalSpacingWidth = (slidesPerView - 1) * spaceBetween;
    const totalSlideWidth = (sliderWidth - totalSpacingWidth) / slidesPerView;

    Array.from(this._slides as unknown as HTMLElement[]).forEach(
      (slide) => (slide.style.width = `${totalSlideWidth}px`),
    );

    Array.from(this._slides as unknown as HTMLElement[])
      .slice(0, -1)
      .forEach((slide) => {
        slide.style.marginRight = `${spaceBetween}px`;
      });
  }
}

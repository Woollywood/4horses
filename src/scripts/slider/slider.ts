import { animate, circ } from "../utils";
import { type SliderOptions, type SliderBox } from "./interface";

export class Slider {
  private _sliderElement: HTMLElement | null = null;
  private _sliderElementWrapper: HTMLElement | null = null;
  private _slides: HTMLCollection | null = null;
  private _options: SliderOptions | null | undefined = null;

  private _sliderBox: SliderBox | null = null;

  private _slideIndex = 0;

  constructor(sliderElem: HTMLElement, options?: SliderOptions) {
    this._init(sliderElem, options);
    this._buildSlides();
    this._prepareSlides();
    this._navigationBuild();
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
  }

  /**
   * Настройки стилей для слайдеров
   */
  private _buildSlides() {
    const { slidesPerView, spaceBetween } = this._options!;

    const sliderWidth = this._sliderElement?.clientWidth!;
    const totalSpacingWidth = (slidesPerView - 1) * spaceBetween;
    const totalSlideWidth = (sliderWidth - totalSpacingWidth) / slidesPerView;

    this._sliderBox = {
      sliderWidth,
      totalSlideWidth,
      totalSpacingWidth,
    };

    Array.from(this._slides as unknown as HTMLElement[]).forEach(
      (slide) => (slide.style.width = `${totalSlideWidth}px`),
    );

    Array.from(this._slides as unknown as HTMLElement[])
      .slice(0, -1)
      .forEach((slide) => {
        slide.style.marginRight = `${spaceBetween}px`;
      });
  }

  /**
   * Подготовка слайдеров
   */
  private _prepareSlides() {
    Array.from(this._slides as unknown as HTMLElement[]).forEach((slide) => {
      const images = slide.querySelectorAll("img");
      if (images) {
        images.forEach((img) => {
          img.addEventListener("dragstart", (e) => {
            e.preventDefault();
          });
        });
      }
    });
  }

  /**
   * Настройка навигации
   */
  private _navigationBuild() {
    const { navigation } = this._options!;
    const { buttonPrev, buttonNext } = navigation!;

    buttonPrev.addEventListener("click", (e) =>
      this.slideTo(this._slideIndex - 1),
    );

    buttonNext.addEventListener("click", (e) =>
      this.slideTo(this._slideIndex + 1),
    );
  }

  public slideTo(index: number, speed = 300) {
    const { spaceBetween } = this._options!;
    const { totalSlideWidth } = this._sliderBox!;

    // @ts-ignore
    this._sliderElementWrapper.style.cssText = `
    	transition-duration: ${speed}ms;
    	transform: translate3d(-${index * totalSlideWidth + index * spaceBetween}px, 0px, 0px);
    	transition-delay: 0ms;
    `;

    this._slideIndex = index;
  }
}

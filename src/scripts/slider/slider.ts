import { animate, circ } from "../utils";
import {
  type SliderOptions,
  type SliderBaseOptions,
  type SliderBox,
} from "./interface";
import { Draggable } from "./draggable";

export class Slider {
  private _sliderElementWrapper: HTMLElement | null = null;
  private _slides: HTMLCollection | null = null;
  private _computedOptions: SliderBaseOptions | null = null;

  private _sliderBox: SliderBox | null = null;
  private _slideIndex = 0;
  private _slideOffset = 0;

  private _draggableEngine: Draggable | null = null;

  constructor(
    private _sliderElement: HTMLElement,
    private _options?: SliderOptions,
  ) {
    this._init();
    this._buildSlides();
    this._navigationBuild();
    // this._buildDraggable();

    window.addEventListener("resize", () => this._buildSlides());
  }

  /**
   *
   * Первичные настройки и присваивания
   *
   * @param sliderElem
   * @param options
   */
  private _init() {
    this._sliderElementWrapper =
      this._sliderElement.querySelector(".slider-wrapper")!;
    this._slides = this._sliderElementWrapper?.children;
  }

  private _buildComputedProperties() {
    const { breakPoints } = this._options!;

    const currentBreakpoint = Object.entries(breakPoints!)
      .slice()
      .reverse()
      .find(([key, _]) => window.innerWidth >= Number(key))!;

    const [_, currentValues] = currentBreakpoint;
    this._computedOptions = currentValues;
  }

  /**
   * Расчет пропорций элементов
   */
  private _calculateBoundingRect() {
    const { slidesPerView, spaceBetween } = this._computedOptions!;

    const sliderWidth = this._sliderElement?.clientWidth!;
    const totalSpacingWidth = (slidesPerView! - 1) * spaceBetween!;
    const totalSlideWidth = (sliderWidth - totalSpacingWidth) / slidesPerView!;

    this._sliderBox = {
      sliderWidth,
      totalSlideWidth,
      totalSpacingWidth,
    };
  }

  /**
   * Настройки стилей для слайдеров
   */
  private _buildSlides() {
    this._buildComputedProperties();
    this._calculateBoundingRect();

    const { spaceBetween } = this._computedOptions!;
    const { totalSlideWidth } = this._sliderBox!;

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
   * Настройка draggable
   */
  private _buildDraggable() {
    this._draggableEngine = new Draggable(this._sliderElementWrapper!);

    let dragOffset = 0;
    const sufficientOffset = this._sliderBox?.totalSlideWidth! / (3 / 2);

    function nextSlide() {
      console.log("more");
    }

    function prevSlide() {
      console.log("prev");
    }

    this._draggableEngine.subscribe((_, offset) => {
      dragOffset = this._slideOffset + Math.floor(offset);

      this._slideToOffsetStyleX(-dragOffset);
    });

    if (Math.abs(dragOffset) >= sufficientOffset) {
      this._draggableEngine?.subscribeEnd(nextSlide);
    } else {
      this._draggableEngine?.subscribeEnd(prevSlide);
    }
  }

  /**
   * Стили для контейнера
   *
   * @param offsetX
   */
  private _slideToOffsetStyleX(offsetX: number, speed = 300) {
    // @ts-ignore
    this._sliderElementWrapper.style.cssText = `
		transition-duration: ${speed}ms;
		transform: translate3d(-${offsetX}px, 0px, 0px);
		transition-delay: 0ms;
	`;
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
    const { spaceBetween } = this._computedOptions!;
    const { totalSlideWidth } = this._sliderBox!;
    this._slideOffset = index * totalSlideWidth + index * spaceBetween!;
    this._slideToOffsetStyleX(this._slideOffset);

    this._slideIndex = index;
  }
}

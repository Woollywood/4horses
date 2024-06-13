import { initialOptions } from "./utils";
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
    this._optionsConcat();
    this._init();
    this._buildSlides();
    this._options?.navigation ? this._navigationBuild() : null;
    // this._buildDraggable();

    window.addEventListener("resize", () => this._buildSlides());
  }

  /**
   * Заполнение _options дефолтными значениями
   */
  private _optionsConcat() {
    const defaultOptions = initialOptions();

    if (!this._options) {
      this._options = defaultOptions;
    } else {
      Object.entries(defaultOptions).forEach(([key, value]) => {
        // @ts-ignore
        if (!this._options[key]) {
          // @ts-ignore
          this._options[key] = value;
        }
      });
    }
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
    const { breakpoints } = this._options!;

    if (breakpoints) {
      const currentBreakpoint = Object.entries(breakpoints!)
        .slice()
        .reverse()
        .find(([key, _]) => window.innerWidth >= Number(key))!;

      const [_, currentValues] = currentBreakpoint;
      this._computedOptions = currentValues;
    } else {
      const { spaceBetween, slidesPerView } = this._options!;

      this._computedOptions = {
        spaceBetween,
        slidesPerView,
      };
    }
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
    const { slidesPerView } = this._computedOptions!;

    buttonPrev.addEventListener("click", () => {
      if (this._slideIndex === 0) {
        this._slideIndex = this._slides?.length! - slidesPerView! + 1;
      }

      this.slideTo(this._slideIndex - 1);
    });

    buttonNext.addEventListener("click", () => {
      if (this._slideIndex >= this._slides?.length! - slidesPerView!) {
        this._slideIndex = -1;
      }

      this.slideTo(this._slideIndex + 1);
    });
  }

  public slideTo(index: number, speed = 300) {
    const { spaceBetween } = this._computedOptions!;
    const { totalSlideWidth } = this._sliderBox!;
    this._slideOffset = index * totalSlideWidth + index * spaceBetween!;
    this._slideToOffsetStyleX(this._slideOffset);

    this._slideIndex = index;
  }
}

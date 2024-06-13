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

  private _isLock = false;

  constructor(
    private _sliderElement: HTMLElement,
    private _options?: SliderOptions,
  ) {
    this._optionsConcat();
    this._init();
    this._buildSlidesAttributes();
    this._buildSlides();

    this._options?.autoplay ? this._autoplayBuild() : null;
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

  /**
   * Расчет вычисленных значений от ширины экрана и брейкпоинтов
   */
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
   * Настройка атрибутов для слайдов
   */
  private _buildSlidesAttributes() {
    Array.from(this._slides as unknown as HTMLElement[]).forEach(
      (slide, index) => (slide.dataset.slideIndex = String(index)),
    );
  }

  /**
   * Настройки стилей для слайдов
   */
  private _buildSlides() {
    this._buildComputedProperties();
    this._calculateBoundingRect();

    const { spaceBetween } = this._computedOptions!;
    const { totalSlideWidth } = this._sliderBox!;

    this._slides = this._sliderElementWrapper?.children!;

    Array.from(this._slides as unknown as HTMLElement[]).forEach((slide) => {
      slide.style.width = `${totalSlideWidth}px`;
      slide.style.margin = "0";
    });

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

      //   this._slideToOffsetStyleX(-dragOffset);
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
  private _slideToOffsetStyleX(offsetX: number, speed: number) {
    // @ts-ignore
    this._sliderElementWrapper.style.cssText = `
		transition-duration: ${speed}ms;
		transform: translate3d(-${offsetX}px, 0px, 0px);
		transition-delay: 0ms;
	`;
  }

  private _nextSlide() {
    this._isLock = true;
    this._sliderElementWrapper?.addEventListener(
      "transitionend",
      () => (this._isLock = false),
      {
        once: true,
      },
    );

    const { loop, speed, slidesPerView } = this._options!;

    const slideTo = (index: number) => {
      const { speed } = this._options!;
      this.slideTo(index, speed);
    };

    if (this._slideIndex < this._slides?.length! - slidesPerView!) {
      slideTo(this._slideIndex + 1);
    } else if (loop) {
      const firstSlide = this._slides![0];
      this._sliderElementWrapper?.append(firstSlide);
      this._buildSlides();
      this.slideTo(this._slides?.length! - slidesPerView! - 1, 0);
      this.slideTo(this._slides?.length! - slidesPerView! - 1, 0);

      setTimeout(() => {
        this.slideTo(this._slides?.length! - slidesPerView!, speed);
      }, 10);
    }
  }

  private _prevSlide() {
    this._isLock = true;
    this._sliderElementWrapper?.addEventListener(
      "transitionend",
      () => (this._isLock = false),
      {
        once: true,
      },
    );

    const { loop, speed } = this._options!;

    const slideTo = (index: number) => {
      const { speed } = this._options!;
      this.slideTo(index, speed);
    };

    if (this._slideIndex !== 0) {
      slideTo(this._slideIndex - 1);
    } else if (loop) {
      const lastSlide = this._slides![this._slides?.length! - 1];
      this._sliderElementWrapper?.prepend(lastSlide);
      this._buildSlides();
      this.slideTo(1, 0);
      this._slideIndex = 1;

      setTimeout(() => {
        this.slideTo(0, speed);
      }, 0);
    }
  }

  /**
   * Настройка автоматического пролистывания
   */
  private _autoplayBuild() {
    const { autoplay } = this._options!;
    const { delay } = autoplay!;

    setInterval(() => {
      this._isLock = true;
      this._nextSlide();
      this._sliderElementWrapper?.addEventListener(
        "transitionend",
        () => {
          this._isLock = false;
        },
        {
          once: true,
        },
      );
    }, delay);
  }

  /**
   * Настройка навигации
   */
  private _navigationBuild() {
    const { navigation } = this._options!;
    const { buttonPrev, buttonNext } = navigation!;

    buttonPrev.addEventListener("click", () => {
      if (!this._isLock) {
        this._prevSlide();
      }
    });

    buttonNext.addEventListener("click", () => {
      if (!this._isLock) {
        this._nextSlide();
      }
    });
  }

  public slideTo(index: number, speed = 300) {
    const { spaceBetween } = this._computedOptions!;
    const { totalSlideWidth } = this._sliderBox!;
    this._slideOffset = index * totalSlideWidth + index * spaceBetween!;
    this._slideToOffsetStyleX(this._slideOffset, speed);

    this._slideIndex = index;
  }
}

type CallbackType = (e: PointerEvent, offset: number) => void;
type CallbackEndType = () => void;

export class Draggable {
  private callbacks: CallbackType[] = [];
  private callbacksEnd: CallbackEndType[] = [];
  private _isDragging = false;

  private _startX = 0;

  constructor(private _draggableContainer: HTMLElement) {
    this._preventDefaults();
    this._pointerDown();
    this._pointerUp();
    this._pointerMove();
  }

  /**
   * Отменяем стандартное поведение d&d для картинок
   */
  private _preventDefaults() {
    Array.from(
      this._draggableContainer.children as unknown as HTMLElement[],
    ).forEach((slide) => {
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
   * Инициализация старта draggable
   */
  private _pointerDown() {
    const containerBox = this._draggableContainer.getBoundingClientRect();

    this._draggableContainer.addEventListener("pointerdown", (e) => {
      this._draggableContainer.setPointerCapture(e.pointerId);
      this._draggableContainer.classList.add("dragging");
      this._isDragging = true;

      this._startX = e.pageX - containerBox.left;
    });
  }

  /**
   * Инициализация окончания draggable
   */
  private _pointerUp() {
    this._draggableContainer.addEventListener("pointerup", () => {
      this._draggableContainer.classList.remove("dragging");
      this._isDragging = false;

      this.callbacksEnd.forEach((callback) => callback());
    });
  }

  /**
   * Инициализация перемещения указателя в рабочем режиме
   */
  private _pointerMove() {
    const containerBox = this._draggableContainer.getBoundingClientRect();

    this._draggableContainer.addEventListener("pointermove", (e) => {
      if (this._isDragging) {
        this.callbacks.forEach((callback) => {
          const currentValue = e.pageX - containerBox.left;

          callback(e, currentValue - this._startX);
        });
      }
    });
  }

  subscribe(callback: CallbackType) {
    this.callbacks.push(callback);
  }

  subscribeEnd(callback: CallbackEndType) {
    this.callbacksEnd.push(callback);
  }
}

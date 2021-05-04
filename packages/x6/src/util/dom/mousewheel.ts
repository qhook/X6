import JQuery from 'jquery'
import { Platform } from '../platform'

export class MouseWheelHandle {
  private target: HTMLElement
  private onWheelCallback: MouseWheelHandle.OnWheelCallback
  private animationFrameId = 0
  private deltaX = 0
  private deltaY = 0
  private eventName = Platform.isEventSupported('wheel')
    ? 'wheel'
    : 'mousewheel'

  constructor(
    target: HTMLElement,
    onWheelCallback: MouseWheelHandle.OnWheelCallback,
  ) {
    this.target = target
    this.onWheelCallback = onWheelCallback
    this.onWheel = this.onWheel.bind(this)
    this.didWheel = this.didWheel.bind(this)
  }

  public enable() {
    if (Platform.SUPPORT_PASSIVE) {
      this.target.addEventListener(this.eventName, this.onWheel, {
        passive: false,
      })
    } else {
      JQuery(this.target).on('mousewheel', this.onWheel)
    }
  }

  public disable() {
    if (Platform.SUPPORT_PASSIVE) {
      this.target.removeEventListener(this.eventName, this.onWheel)
    } else {
      JQuery(this.target).off('mousewheel')
    }
  }

  private onWheel(e: JQueryMousewheel.JQueryMousewheelEventObject) {
    this.deltaX += e.deltaX
    this.deltaY += e.deltaY
    e.preventDefault()

    let changed
    if (this.deltaX !== 0 || this.deltaY !== 0) {
      e.stopPropagation()
      changed = true
    }

    if (changed === true && this.animationFrameId === 0) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.didWheel(e)
      })
    }
  }

  private didWheel(e: JQueryMousewheel.JQueryMousewheelEventObject) {
    this.animationFrameId = 0
    this.onWheelCallback(e, this.deltaX, this.deltaY)
    this.deltaX = 0
    this.deltaY = 0
  }
}

export namespace MouseWheelHandle {
  export type OnWheelCallback = (
    e: JQueryMousewheel.JQueryMousewheelEventObject,
    deltaX?: number,
    deltaY?: number,
  ) => void
}
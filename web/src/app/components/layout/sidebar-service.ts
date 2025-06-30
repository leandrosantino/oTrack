import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() {
    effect(() => {
      if (!this.isMobile()) {
        this._open.set(true)
      }
    })
  }

  private readonly MOBILE_BREAKPOINT = 768

  private _open = signal(true)

  open = this._open.asReadonly()

  private _isMobile = signal(false)

  isMobile = this._isMobile.asReadonly()

  toggle() {
    this._open.set(!this.open())
  }

  startPageSizeListenner() {
    const mql = window.matchMedia(`(max-width: ${this.MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      this._isMobile.set(window.innerWidth < this.MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    this._isMobile.set(window.innerWidth < this.MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }

}

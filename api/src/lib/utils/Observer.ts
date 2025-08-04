import { singleton } from "tsyringe"

@singleton()
export class Observer<T> {

  private substribers: ((data: T) => void)[] = []

  subscribe(cb: (data: T) => void): () => void {
    this.substribers.push(cb)
    return () => {
      this.substribers = this.substribers.filter(substriber => substriber !== cb)
    }
  }

  async notifyAll(data: T) {
    this.substribers.forEach(cb => cb(data))
  }

}

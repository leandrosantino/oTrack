import z from "zod";

export class WsClient {

  private listener: EventTarget

  WS_EVENT_DATA_SCHEMA = z.object({
    event: z.string(),
    payload: z.any()
  })
  private socket: WebSocket

  constructor(url: string) {
    this.listener = new EventTarget()
    this.socket = new WebSocket(url)
    this.socket.onmessage = event => { this.onMessange(event.data) }
  }

  private onMessange(chunk: any) {
    try {
      const data = JSON.parse(chunk.toString())
      const { event, payload } = this.WS_EVENT_DATA_SCHEMA.parse(data)
      this.listener.dispatchEvent(new CustomEvent(event, { detail: payload }))
    } catch { }
  }

  on(event: string, callback: (payload: any) => void) {
    this.listener.addEventListener(event, (a) => { callback((a as CustomEvent).detail) })
  }

  emit(event: string, payload: any) {
    this.socket.send(JSON.stringify({ event, payload }))
  }

  onClose(call: VoidFunction) {
    this.socket.onclose = () => { call() }
  }

}

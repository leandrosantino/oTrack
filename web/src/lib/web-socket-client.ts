import z from "zod";
import { EventEmitter } from "./event-emitter";

export class WsClient {

  private listener: EventEmitter

  WS_EVENT_DATA_SCHEMA = z.object({
    event: z.string(),
    payload: z.any()
  })
  private socket: WebSocket

  constructor(url: string) {
    this.listener = new EventEmitter()
    this.socket = new WebSocket(url)
    this.socket.onmessage = event => { this.onMessange(event.data) }
  }

  private onMessange(chunk: any) {
    try {
      const data = JSON.parse(chunk.toString())
      const { event, payload } = this.WS_EVENT_DATA_SCHEMA.parse(data)
      this.listener.emit(event, payload)
    } catch { }
  }

  on(event: string, callback: (payload: any) => void) {
    return this.listener.on(event, (a: any) => { callback(a) })
  }

  emit(event: string, payload: any) {
    this.socket.send(JSON.stringify({ event, payload }))
  }

  close() {
    this.listener.clear()
    this.socket.close()
  }

  onClose(call: VoidFunction) {
    this.socket.onclose = () => { call() }
  }

}

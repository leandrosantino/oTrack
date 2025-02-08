import { User } from "entities/user/User";
import { WS_EVENT_DATA_SCHEMA } from "schemas/WsEventDataSchema";
import { singleton } from "tsyringe";
import { WebSocket, RawData, EventEmitter } from "ws";

@singleton()
export class WsClient {

  private listener: EventEmitter
  profile: User

  constructor(
    private readonly socket: WebSocket,
    profile: User,
  ) {
    this.profile = profile
    this.listener = new EventEmitter()

    this.socket.on("message", this.onMessange.bind(this))
  }

  private onMessange(chunk: RawData) {
    try {
      const data = JSON.parse(chunk.toString())
      const { event, payload } = WS_EVENT_DATA_SCHEMA.parse(data)
      this.listener.emit(event, payload)
    } catch { }
  }

  on(event: string, callback: (payload: any) => void) {
    this.listener.on(event, callback)
  }

  emit(event: string, payload: any) {
    this.socket.send(JSON.stringify({ event, payload }))
  }

  onClose(call: VoidFunction) {
    this.socket.on('close', () => call())
  }

}

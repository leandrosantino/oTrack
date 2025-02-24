import { UserProfile } from "entities/user/UserProfile";
import { EventClient } from "interfaces/EventCLient";
import { WebSocket, RawData, EventEmitter } from "ws";
import z from "zod";

export class WebSocketEventClient implements EventClient {

  private listener: EventEmitter
  profile: UserProfile

  WS_EVENT_DATA_SCHEMA = z.object({
    event: z.string(),
    payload: z.any()
  })

  constructor(
    private readonly socket: WebSocket,
    profile: UserProfile,
  ) {
    this.profile = profile
    this.listener = new EventEmitter()

    this.socket.on("message", this.onMessange.bind(this))
  }

  private onMessange(chunk: RawData) {
    try {
      const data = JSON.parse(chunk.toString())
      const { event, payload } = this.WS_EVENT_DATA_SCHEMA.parse(data)
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

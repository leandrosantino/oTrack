import { UserProfile } from "user/UserProfile";
import { WebSocket, RawData } from "ws";
import z from "zod";
import { EventClient } from "./EventCLient";
import { EventEmitter } from 'node:events';

export class WebSocketEventClient implements EventClient {

  private eventEmitter: EventEmitter
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
    this.eventEmitter = new EventEmitter()

    this.socket.on("message", this.onMessange.bind(this))

  }

  private onMessange(chunk: RawData) {
    try {
      const data = JSON.parse(chunk.toString())
      const { event, payload } = this.WS_EVENT_DATA_SCHEMA.parse(data)
      this.eventEmitter.emit(event, payload)
    } catch { }
  }

  on(event: string, callback: (payload: any) => void) {
    this.eventEmitter.on(event, callback)
  }

  emit(event: string, payload: any) {
    this.socket.send(JSON.stringify({ event, payload }))
  }

  onClose(call: VoidFunction) {
    this.socket.on('close', () => call())
  }

}

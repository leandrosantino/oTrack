import { injectable } from "tsyringe";
import z from "zod";

type Callback = (data: any) => void;


@injectable()
export class EventListener {
  private events: Map<string, Set<Callback>>;

  constructor() {
    this.events = new Map();
  }

  eventDataSchema = z.object({
    event: z.string(),
    payload: z.any()
  })

  newInstance() {
    return new EventListener()
  }

  // Inscrever um callback em um evento
  on(event: string, callback: Callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)?.add(callback);
  }

  // Remover um callback de um evento
  off(event: string, callback: Callback) {
    this.events.get(event)?.delete(callback);
    if (this.events.get(event)?.size === 0) {
      this.events.delete(event);
    }
  }

  // Disparar um evento para todos os inscritos
  emit(event: string, data: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(data);
      }
    }
  }
}

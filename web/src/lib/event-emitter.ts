export class EventEmitter {
  private listeners = new Map<string, Set<Function>>();

  on(eventName: string, listener: Function): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName)!.add(listener);

    return () => {
      this.listeners.get(eventName)!.delete(listener);
      if (this.listeners.get(eventName)!.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  emit(eventName: string, payload?: any): void {
    const listeners = this.listeners.get(eventName);
    if (!listeners) return;

    for (const listener of listeners) {
      listener(payload);
    }
  }

  clear(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}

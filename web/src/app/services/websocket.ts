import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class Websocket {

  constructor() { }

  subject!: WebSocketSubject<{
    event: string;
    payload: any;
  }>

  connect(url: string, ticket: string) {
    this.subject?.complete()
    this.subject = webSocket(url + ticket)
  }

  on$<T>(event: string): Observable<T> {
    return this.subject.asObservable().pipe(
      filter(a => a.event === event),
      map(a => a.payload)
    )
  }

  emit(event: string, payload: any) {
    this.subject.next({ event, payload })
  }

  close() {
    this.subject.complete()
  }

}

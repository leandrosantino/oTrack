import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth';
import { Websocket } from './websocket';

export interface ServiceOrder {
  id: number;
  description: string;
  date: Date
  userId: number
  index: number
  status: 'pending' | 'in_progress' | 'done'
  type: "scheduled" | "corrective"
}

type UpdateKanbanPositionRequestDTO = {
  id: number
  previousIndex?: number
  postIndex?: number
  status: ServiceOrder['status']
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private readonly websocket: Websocket
  ) { }

  onCreated(cb: (order: ServiceOrder) => void) {
    this.websocket.on$<ServiceOrder>('created').subscribe(cb)
  }
  onUpdated(cb: (order: ServiceOrder) => void) {
    this.websocket.on$<ServiceOrder>('updated').subscribe(cb)
  }

  closeRealtime() {
    this.websocket.close()
  }

  getAll() {
    return this.httpClient.get<ServiceOrder[]>('/service-order')
  }

  startRealtime() {
    return this.authService.generateWebSocketTicket().pipe(
      switchMap(({ ticket }) => {
        this.websocket.connect('ws://localhost:3000/service-order/realtime/', ticket)
        return this.websocket.on$<ServiceOrder[]>('connected')
      })
    )
  }

  updateKanbanPosition(data: UpdateKanbanPositionRequestDTO) {
    return new Observable<ServiceOrder>(observer => {
      try {
        this.websocket.emit('updateKanbanPosition', data)
        const sub = this.websocket.on$<ServiceOrder>('updateKanbanPosition')
          .subscribe((updatedOrder: ServiceOrder) => {
            sub.unsubscribe()
            observer.next(updatedOrder)
            observer.complete()
          })
      } catch (err) {
        observer.error(err)
        observer.complete()
      }
    })
  }


}

import { OrderCard } from '@/app/components/order-card/order-card';
import { HlmSkeletonComponent } from '@/app/components/ui/ui-skeleton-helm/src';
import { OrdersService, ServiceOrder } from '@/app/services/orders';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSquareDashedMousePointer } from '@ng-icons/lucide';
import { LucideAngularModule } from 'lucide-angular';

type Frame = {
  title: string
  orders: ServiceOrder[]
}

@Component({
  selector: 'app-service-orders',
  imports: [
    OrderCard, CdkDropList, CdkDropListGroup, CdkDrag,
    LucideAngularModule,
    HlmSkeletonComponent,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideSquareDashedMousePointer
    }),
  ],
  templateUrl: './service-orders.html',
  styleUrl: './service-orders.css'
})
export class ServiceOrders implements OnInit, OnDestroy {

  readonly framesMap = new Map<string, Frame>([
    ['pending', { title: 'Pendente', orders: [] }],
    ['in_progress', { title: 'Em Andamento', orders: [] }],
    ['done', { title: 'Concluído', orders: [] }]
  ])

  loading = true

  constructor(
    private readonly ordersService: OrdersService
  ) { }

  ngOnDestroy(): void {
    this.ordersService.closeSocketConnection()
  }

  async ngOnInit() {
    this.ordersService.startRealtime().subscribe((data) => {
      this.loading = true
      this.loadServiceOrders(data)
      this.ordersService.onCreated(this.onCreated.bind(this))
      this.ordersService.onUpdated(this.update.bind(this))
      this.loading = false
    })
  }

  update() {
    this.ordersService.getAll().subscribe(this.loadServiceOrders.bind(this))
  }

  onCreated(newOrder: ServiceOrder) {
    const frame = this.framesMap.get(newOrder.status)
    if (!frame) return
    frame.orders = [newOrder, ...frame.orders]
  }

  loadServiceOrders(orders: ServiceOrder[]) {
    this.framesMap.forEach((frame) => { frame.orders = [] })
    orders.forEach(item => {
      this.framesMap.get(item.status)?.orders.push(item)
    })
  }

  private playSuccessSound() {
    const audio = new Audio('/success.mp3');
    audio.play();
  }

  async drop(event: CdkDragDrop<ServiceOrder[]>) {
    if (event.previousContainer === event.container) {
      this.handleSameColumnMove(event)
      return
    }
    if (event.container.id == 'done') this.playSuccessSound()
    this.handleCrossColumnMove(event)
  }

  private handleSameColumnMove(event: CdkDragDrop<ServiceOrder[]>) {
    const fromList = this.framesMap.get(event.previousContainer.id)
    const movingOrder = fromList?.orders[event.previousIndex]
    if (!movingOrder || !fromList) return

    let previousIndex = 0
    let postIndex = 0
    if (event.previousIndex < event.currentIndex) {
      previousIndex = fromList.orders[event.currentIndex]?.index
      postIndex = fromList.orders[event.currentIndex + 1]?.index
    }
    if (event.previousIndex > event.currentIndex) {
      previousIndex = fromList.orders[event.currentIndex - 1]?.index
      postIndex = fromList.orders[event.currentIndex]?.index
    }

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    this.ordersService.updateKanbanPosition({
      id: movingOrder.id,
      previousIndex,
      postIndex,
      status: event.container.id as ServiceOrder['status']
    }).subscribe({
      next: updated => { movingOrder.index = updated.index },
      error: () => this.update()
    })
  }

  private handleCrossColumnMove(event: CdkDragDrop<ServiceOrder[]>) {
    const movingOrder = this.framesMap.get(event.previousContainer.id)?.orders[event.previousIndex]
    if (!movingOrder) return

    const postIndex = this.framesMap.get(event.container.id)?.orders[event.currentIndex]?.index
    const previousIndex = this.framesMap.get(event.container.id)?.orders[event.currentIndex - 1]?.index

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    )

    this.ordersService.updateKanbanPosition({
      id: movingOrder.id,
      previousIndex,
      postIndex,
      status: event.container.id as ServiceOrder['status']
    }).subscribe({
      next: updated => {
        movingOrder.index = updated.index
        movingOrder.status = event.container.id as ServiceOrder['status']
      },
      error: () => this.update()
    })

  }

}

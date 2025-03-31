import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import type { IServiceOrdersService } from "@/domain/services/service-orders-service/IServiceOrdersService";
import { useStateObject } from "@/lib/useStateObject";
import { DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { inject, injectable } from "tsyringe";

type Column = {
  id: string
  title: string
  orders: ServiceOrder[]
}

@injectable()
export class ServiceOrdersController {

  private readonly startColumns: Record<string, Column> = {
    pending: { id: "pending", title: "Pendente", orders: [] },
    in_progress: { id: "in_progress", title: "Em Andamento", orders: [], },
    done: { id: "done", title: "Concluído", orders: [], },
  }

  public columns = useStateObject<Record<string, Column>>({ ...this.startColumns })

  public typeColors: Record<ServiceOrder['type'], string> = {
    corrective: "bg-orange-100 text-orange-800",
    scheduled: "bg-blue-100 text-blue-800",
  }

  public loading = useStateObject(false)

  constructor(
    @inject('ServiceOrdersService') private readonly serviceOrdersService: IServiceOrdersService,
  ) {
    useEffect(() => { this.loadServiceOrders() }, [])
    useEffect(() => { this.startSocket() }, [])
  }

  private async startSocket() {
    await this.serviceOrdersService.startRealtime()
    this.serviceOrdersService.onCreated((order: ServiceOrder) => {
      const column = this.columns.value[order.status]
      column.orders = [order, ...column.orders]
      this.columns.set({ ...this.columns.value, [order.status]: column })
    })
    this.serviceOrdersService.onUpdated(() => { this.loadServiceOrders() })
  }

  private async loadServiceOrders() {
    this.loading.set(true)
    try {
      const serviceOrders = await this.serviceOrdersService.getAll()
      this.startColumns['pending'].orders = []
      this.startColumns['in_progress'].orders = []
      this.startColumns['done'].orders = []
      console.log('updated')
      serviceOrders.forEach(item => {
        this.startColumns[item.status].orders.push(item)
      })
      this.columns.set(this.startColumns)
      this.loading.set(false)
    } catch (err) {
      console.log(err)
    }
  }

  private updatingOrder = useStateObject(false)

  private async handleSameColumnMove(columnId: string, startIndex: number, endIndex: number) {
    if (this.updatingOrder.value) return
    this.updatingOrder.set(true)
    const column = this.columns.value[columnId];
    const updatedOrders = this.reorderList(column.orders, startIndex, endIndex);

    const movingOrder = column.orders[startIndex]
    let previousIndex = 0
    let postIndex = 0
    if (startIndex < endIndex) {
      previousIndex = column.orders[endIndex]?.index
      postIndex = column.orders[endIndex + 1]?.index
    }
    if (startIndex > endIndex) {
      previousIndex = column.orders[endIndex - 1]?.index
      postIndex = column.orders[endIndex]?.index
    }
    const updated = await this.serviceOrdersService.updateKanbanPosition({
      id: movingOrder.id,
      previousIndex,
      postIndex,
      status: columnId as ServiceOrder['status']
    })
    movingOrder.index = updated.index

    this.columns.set({
      ...this.columns.value,
      [columnId]: { ...column, orders: updatedOrders },
    });
    this.updatingOrder.set(false)
  };

  private async handleCrossColumnMove(sourceId: string, destId: string, sourceIndex: number, destIndex: number) {
    const sourceColumn = this.columns.value[sourceId];
    const destColumn = this.columns.value[destId];

    const movingOrder = this.columns.value[sourceId].orders[sourceIndex]
    const previousIndex = this.columns.value[destId].orders[destIndex - 1]?.index
    const postIndex = this.columns.value[destId].orders[destIndex]?.index
    const updated = await this.serviceOrdersService.updateKanbanPosition({
      id: movingOrder.id,
      previousIndex,
      postIndex,
      status: destId as ServiceOrder['status']
    })
    movingOrder.index = updated.index

    const sourceOrders = Array.from(sourceColumn.orders);
    const destOrders = Array.from(destColumn.orders);
    const [removed] = sourceOrders.splice(sourceIndex, 1);
    destOrders.splice(destIndex, 0, removed);

    destOrders[destIndex].status = destId as ServiceOrder['status'];

    this.columns.set({
      ...this.columns.value,
      [sourceId]: { ...sourceColumn, orders: sourceOrders },
      [destId]: { ...destColumn, orders: destOrders },
    });
  };


  public onDragEnd = async (result: DropResult<string>) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (source.droppableId === destination.droppableId) {
      await this.handleSameColumnMove(source.droppableId, source.index, destination.index)
      return
    }
    if (destination.droppableId === 'done') this.playSuccessSound()
    await this.handleCrossColumnMove(source.droppableId, destination.droppableId, source.index, destination.index);
  };

  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }

  onDragUpdate = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  }

  private playSuccessSound() {
    const audio = new Audio('/success.mp3');
    audio.play();
  }

  private reorderList<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

}

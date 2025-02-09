import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import { useStateObject } from "@/lib/useStateObject";
import { DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { injectable } from "tsyringe";
import { serviceOrders } from ".";

type Column = {
  id: string
  title: string
  orders: ServiceOrder[]
}

@injectable()
export class ServiceOrdersController {

  public columns = useStateObject<Record<string, Column>>({
    pending: { id: "pending", title: "Pendente", orders: [] },
    inProgress: { id: "inProgress", title: "Em Andamento", orders: [], },
    done: { id: "done", title: "Concluído", orders: [], },
  })

  public priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  constructor() {
    useEffect(() => { this.loadServiceOrders() }, [])
  }

  private loadServiceOrders() {
    const oldColumns = { ...this.columns.value }
    serviceOrders.forEach(item => {
      oldColumns[item.status].orders.push(item)
    })
    this.columns.set(oldColumns)
  }

  private handleSameColumnMove(columnId: string, startIndex: number, endIndex: number) {
    const column = this.columns.value[columnId];
    const updatedOrders = this.reorderList(column.orders, startIndex, endIndex);

    this.columns.set({
      ...this.columns.value,
      [columnId]: { ...column, orders: updatedOrders },
    });
  };

  private handleCrossColumnMove(sourceId: string, destId: string, sourceIndex: number, destIndex: number) {
    const sourceColumn = this.columns.value[sourceId];
    const destColumn = this.columns.value[destId];

    const sourceOrders = Array.from(sourceColumn.orders);
    const destOrders = Array.from(destColumn.orders);
    const [removed] = sourceOrders.splice(sourceIndex, 1);
    destOrders.splice(destIndex, 0, removed);

    this.columns.set({
      ...this.columns.value,
      [sourceId]: { ...sourceColumn, orders: sourceOrders },
      [destId]: { ...destColumn, orders: destOrders },
    });
  };


  public onDragEnd = (result: DropResult<string>) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (source.droppableId === destination.droppableId) {
      this.handleSameColumnMove(source.droppableId, source.index, destination.index)
      return
    }
    this.handleCrossColumnMove(source.droppableId, destination.droppableId, source.index, destination.index);
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


  private reorderList<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

}

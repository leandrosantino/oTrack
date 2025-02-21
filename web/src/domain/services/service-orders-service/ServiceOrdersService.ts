import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import type { IHttpClient } from "@/domain/providers/http-client/IHttpClient";
import { WsClient } from "@/lib/web-socket-client";
import { inject, singleton } from "tsyringe";
import type { IAuthService } from "../auth-service/IAuthService";
import { IServiceOrdersService, UpdateServiceOrderKanbanPositionRequestDTO } from "./IServiceOrdersService";

@singleton()
export class ServiceOrdersService implements IServiceOrdersService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient,
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  private socketClient!: WsClient


  onCreated(cb: (order: ServiceOrder) => void) {
    this.socketClient.on('created', cb)
  }
  onUpdated(cb: (order: ServiceOrder) => void) {
    this.socketClient.on('updated', cb)
  }

  async startRealtime(): Promise<void> {
    const ticket = await this.authService.generateWebSocketTicket()
    this.socketClient = new WsClient('ws://localhost:3000/service-order/realtime/' + ticket)
  }

  async updateKanbanPosition(data: UpdateServiceOrderKanbanPositionRequestDTO): Promise<ServiceOrder> {
    return await new Promise<ServiceOrder>((resolve) => {
      this.socketClient.emit('updateKanbanPosition', data)
      this.socketClient.on('updateKanbanPositionReturn', (updatedOrder: ServiceOrder) => {
        resolve(updatedOrder)
      })
    })
  }

  async getAll(): Promise<ServiceOrder[]> {
    const response = await this.httpClient.get<ServiceOrder[]>('/service-order')
    if (!response.ok) throw new Error(response.err.message)
    return response.value
  }

}
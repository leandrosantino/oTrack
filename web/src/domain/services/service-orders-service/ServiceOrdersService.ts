import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import type { IHttpClient } from "@/domain/providers/http-client/IHttpClient";
import { inject, singleton } from "tsyringe";
import { IServiceOrdersService } from "./IServiceOrdersService";

@singleton()
export class ServiceOrdersService implements IServiceOrdersService {

  constructor(
    @inject('HttpClient') private readonly httpClient: IHttpClient
  ) { }


  async getAll(): Promise<ServiceOrder[]> {
    const response = await this.httpClient.get<ServiceOrder[]>('/service-order')
    if (!response.ok) throw new Error(response.err.message)
    return response.value
  }


}
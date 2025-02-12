import { prisma } from "database";
import { IServiceOrderRepository } from "entities/service-order/IServiceOrderRepository";
import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { injectable } from "tsyringe";

@injectable()
export class ServiceOrderRepository implements IServiceOrderRepository {

  async exists(id: number): Promise<boolean> {
    return !!await prisma.serviceOrders.findUnique({
      where: { id }
    });
  }

  async getById(id: number): Promise<ServiceOrder | null> {
    const serviceOrder = await prisma.serviceOrders.findUnique({
      where: { id }
    });
    return serviceOrder as ServiceOrder
  }

  async findMany(): Promise<ServiceOrder[]> {
    const serviceOrder = await prisma.serviceOrders.findMany({
      orderBy: {
        index: 'asc'
      }
    })
    return serviceOrder as ServiceOrder[]
  }

  async create(entity: Omit<ServiceOrder, "id">): Promise<ServiceOrder> {
    return await prisma.serviceOrders.create({
      data: entity
    }) as ServiceOrder
  }

  async update(entity: Partial<ServiceOrder>): Promise<ServiceOrder> {
    return await prisma.serviceOrders.update({
      where: { id: entity.id },
      data: entity
    }) as ServiceOrder
  }

}

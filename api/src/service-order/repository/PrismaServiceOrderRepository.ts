import { Injectable } from "@nestjs/common";
import { prisma } from "database";
import { ServiceOrderRepository } from "service-order/repository/ServiceOrderRepository";
import { ServiceOrder } from "service-order/entities/ServiceOrder";

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {

  async getHigherIndex(): Promise<number> {
    const { _max } = await prisma.serviceOrders.aggregate({
      _max: { index: true }
    })
    return _max?.index || 0
  }

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
        index: 'desc'
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

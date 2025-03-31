import { inject, singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "../DTOs";
import { UpdateServiceOrder } from "./UpdateServiceOrder";

@singleton()
export class UpdateServiceOrderKanbanPosition {

  constructor(
    @inject('UpdateServiceOrder') private readonly updateServiceOrder: UpdateServiceOrder
  ) { }

  async execute({ id, previousIndex, postIndex, status }: UpdateServiceOrderKanbanPositionRequestDTO) {
    if (!previousIndex && !postIndex) return null

    let index = 0
    if (postIndex && !previousIndex) index = postIndex + 100
    if (previousIndex && !postIndex) index = previousIndex - 100
    if (previousIndex && postIndex && previousIndex > 0 && postIndex > 0) {
      index = (postIndex + previousIndex) / 2
    }

    return await this.updateServiceOrder.execute({ id, index, status })
  }


}

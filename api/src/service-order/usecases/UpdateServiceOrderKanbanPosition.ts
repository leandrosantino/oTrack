import { inject, singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "../DTOs";
import { UpdateServiceOrder } from "./UpdateServiceOrder";

@singleton()
export class UpdateServiceOrderKanbanPosition {

  constructor(
    @inject('UpdateServiceOrder') private readonly updateServiceOrder: UpdateServiceOrder
  ) { }

  async execute({ id, previousIndex, postIndex, status }: UpdateServiceOrderKanbanPositionRequestDTO) {

    let index: number | undefined = 0
    if (!postIndex && !previousIndex) index = undefined
    if (postIndex && !previousIndex) index = postIndex + 100
    if (previousIndex && !postIndex) index = previousIndex - 100
    if (previousIndex && postIndex && previousIndex > 0 && postIndex > 0) {
      index = (postIndex + previousIndex) / 2
    }

    return await this.updateServiceOrder.execute({ id, index, status })
  }


}

import { inject, singleton } from "tsyringe";
import { IUpdateServiceOrder, UpdateServiceOrderKanbanPositionRequestDTO } from "./types";

@singleton()
export class UpdateServiceOrderKanbanPosition {

  constructor(
    @inject('UpdateServiceOrder') private readonly updateServiceOrder: IUpdateServiceOrder
  ) { }

  async execute({ id, previousIndex, postIndex, status }: UpdateServiceOrderKanbanPositionRequestDTO) {
    if (!previousIndex && !postIndex) return

    let index = 0
    if (postIndex && !previousIndex) index = postIndex + 100
    if (previousIndex && !postIndex) index = previousIndex - 100
    if (previousIndex && postIndex && previousIndex > 0 && postIndex > 0) {
      index = (postIndex + previousIndex) / 2
    }

    console.log(previousIndex, postIndex)

    return await this.updateServiceOrder.execute({ id, index, status })
  }


}

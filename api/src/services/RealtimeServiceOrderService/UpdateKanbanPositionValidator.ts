import { ServiceOrderStatus } from "entities/service-order/ServiceOrderStatus";
import { ValidationException, Validator } from "interfaces/Validator";
import { singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "use-cases/service-order/types";
import z from "zod";

@singleton()
export class UpdateKanbanPositionValidator implements Validator<UpdateServiceOrderKanbanPositionRequestDTO> {

  private UPDATE_PAYLOAD_SCHEMA = z.object({
    id: z.number(),
    status: z.nativeEnum(ServiceOrderStatus),
    previousIndex: z.number().optional(),
    postIndex: z.number().optional(),
  })

  parse(data: UpdateServiceOrderKanbanPositionRequestDTO): Result<UpdateServiceOrderKanbanPositionRequestDTO, ValidationException> {
    const { success, data: tokenData } = this.UPDATE_PAYLOAD_SCHEMA.safeParse(data)
    if (!success) {
      return Err(new ValidationException.InvalidData())
    }
    return Ok(tokenData)
  }


}

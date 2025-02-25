import { ServiceOrderStatus } from "service-order/ServiceOrderStatus";
import { singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "service-order/DTOs";
import z from "zod";
import { Validator } from "shared/Validator/Validator";
import { ValidationException } from "shared/Validator/ValidatorException";

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

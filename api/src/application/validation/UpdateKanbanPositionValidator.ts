import { singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "application/use-cases/service-order/types";
import z from "zod";
import { Validator } from "application/validation/Validator";
import { ValidationException } from "application/validation/ValidatorException";
import { ServiceOrderStatus } from "domain/entities/service-order/ServiceOrderStatus";

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

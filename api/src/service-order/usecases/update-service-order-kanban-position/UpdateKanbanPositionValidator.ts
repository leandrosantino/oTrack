import { ServiceOrderStatus } from "service-order/entities/ServiceOrderStatus";
import { singleton } from "tsyringe";
import { UpdateServiceOrderKanbanPositionRequestDto } from "service-order/dto/UpdateServiceOrderKanbanPositionRequestDto";
import z from "zod";
import { Validator } from "lib/Validator/Validator";
import { ValidationException } from "lib/Validator/ValidatorException";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateKanbanPositionValidator implements Validator<UpdateServiceOrderKanbanPositionRequestDto> {

  private UPDATE_PAYLOAD_SCHEMA = z.object({
    id: z.number(),
    status: z.nativeEnum(ServiceOrderStatus),
    previousIndex: z.number().optional(),
    postIndex: z.number().optional(),
  })

  parse(data: UpdateServiceOrderKanbanPositionRequestDto): Result<UpdateServiceOrderKanbanPositionRequestDto, ValidationException> {
    const { success, data: tokenData } = this.UPDATE_PAYLOAD_SCHEMA.safeParse(data)
    if (!success) {
      return Err(new ValidationException.InvalidData())
    }
    return Ok(tokenData)
  }


}

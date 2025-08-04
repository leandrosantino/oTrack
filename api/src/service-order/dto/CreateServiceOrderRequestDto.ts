import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator"
import { ServiceOrderStatus } from "service-order/ServiceOrderStatus"
import { ServiceOrderType } from "service-order/ServiceOrderType"

export class CreateServiceOrderRequestDto {
  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty()
  @IsDateString()
  date: string

  @ApiProperty()
  @IsEnum(ServiceOrderStatus)
  status: ServiceOrderStatus

  @ApiProperty()
  @IsEnum(ServiceOrderType)
  type: ServiceOrderType

  @ApiProperty()
  @IsNumber()
  userId: number
}

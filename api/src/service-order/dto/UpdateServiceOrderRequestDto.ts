import { CreateServiceOrderRequestDto } from "./CreateServiceOrderRequestDto";

export type UpdateServiceOrderRequestDto = Partial<CreateServiceOrderRequestDto> & { id: number, index?: number }

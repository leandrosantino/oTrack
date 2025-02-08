import z from "zod";

export const WS_EVENT_DATA_SCHEMA = z.object({
  event: z.string(),
  payload: z.any()
})

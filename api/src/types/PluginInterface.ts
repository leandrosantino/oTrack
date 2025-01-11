import { FastifyPluginAsync, RawServerDefault } from "fastify";
import { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod";

export interface ControllerInterface {
  routes: FastifyPluginAsyncZod
}

import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export interface ControllerInterface {
  routes: FastifyPluginAsyncZod
}

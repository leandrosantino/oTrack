import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";

export interface ControllerInterface {
  routes: FastifyPluginAsync
}

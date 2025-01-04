import "reflect-metadata";
import 'dotenv/config'

import Fastify from "fastify";
import { authController, webSocketController } from "factory";
import fastifyWebsocket from "@fastify/websocket";

const fastify = Fastify()

fastify
  .register(fastifyWebsocket)
  .register(authController.plugin)
  .register(webSocketController.plugin)


fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(
    `🌍 Server is running at ${address}`
  )
})

import "reflect-metadata";
import 'dotenv/config'

import Fastify from "fastify";
import { authController, webSocketController } from "factory";
import { fastifyWebsocket } from "@fastify/websocket";

const app = Fastify()

//Externals Plugins
app.register(fastifyWebsocket)

//Local Plugins
app.register(authController.routes)
app.register(webSocketController.routes)


app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(
    `🌍 Server is running at ${address}`
  )
})

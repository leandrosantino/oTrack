import "reflect-metadata";
import Dotenv from 'dotenv'

import Fastify from "fastify";
import { authController, errorMiddleware, usersController, webSocketController } from "factory";
import { fastifyWebsocket } from "@fastify/websocket";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

Dotenv.config()

const app = Fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


//Externals Plugins
app.register(fastifyWebsocket)
app.register(fastifyCors, { origin: '*' })
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: '',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Opcional, para informar o formato do token
          description: 'Enter your Bearer token in the format `Bearer <token>`',
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Aplica autenticação global
      },
    ],
  },
  transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  transformStaticCSP: (header) => header
})

app.setErrorHandler(errorMiddleware.build)

//Local Plugins
app.register(authController.routes)
app.register(webSocketController.routes)
app.register(usersController.routes)


app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(
    '\n' +
    `🌍 Server is running at ${address}` +
    '\n' +
    `📖 Access docs in ${address}/docs`
  )
})

import "reflect-metadata";

import Fastify from "fastify";
import { fastifyWebsocket } from "@fastify/websocket";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyCookie } from "@fastify/cookie";
import { properties, errorMiddleware, authController, usersController, serviceOrdersController, realtimeServiceOrderController, locationSharingController, recoverPasswordController } from "factory";

const app = Fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


//Externals Plugins
app.register(fastifyWebsocket)
app.register(fastifyCors, {
  origin: properties.env.CORS_ORIGINS.split(','),
  credentials: true
})
app.register(fastifyCookie, {
  secret: properties.env.COOKIE_SECRET,
});
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

app.setErrorHandler(errorMiddleware.build())

//Local Plugins
app.register(authController.routes, { prefix: 'auth' })
app.register(recoverPasswordController.routes, { prefix: 'auth' })
app.register(usersController.routes, { prefix: 'user' })
app.register(serviceOrdersController.routes, { prefix: 'service-order' })
app.register(realtimeServiceOrderController.routes, { prefix: 'service-order' })
app.register(locationSharingController.routes)


app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(
    '\n' +
    `🌍 Server is running at http://localhost:3000` +
    '\n' +
    `📖 Access docs in http://localhost:3000/docs`
  )
})


import 'lib/utils/Result'
import 'lib/utils/properties'

import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'app.module';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { apiReference } from '@scalar/nestjs-api-reference'
import fastifyWebsocket from '@fastify/websocket';
import { RealtimeServiceOrderService } from 'service-order/services/realtime-service-order-service/realtime-service-order.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn', 'debug', 'verbose', 'fatal'] }
  );

  app.register(fastifyCors, {
    origin: properties.CORS_ORIGINS.split(','),
    credentials: true
  })

  app.getHttpAdapter().getInstance().register(fastifyWebsocket)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // erro se mandar propriedades extras
    transform: true, // converte tipos automaticamente
  }));

  app.register(fastifyCookie, {
    secret: properties.COOKIE_SECRET,
  });


  const config = new DocumentBuilder()
    .setTitle('oTrack API')
    .setDescription('Documentação gerada automaticamente')
    .setVersion('0.3')
    .addSecurity('BearerAuth', {
      type: 'http',
      in: 'header',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      description: 'Enter your Bearer token in the format `Bearer <token>`',
    })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', apiReference({
    content: document,
    withFastify: true,
    authentication: {
      preferredSecurityScheme: 'BearerAuth'
    }
  }))

  const realtimeServiceOrderService = app.get(RealtimeServiceOrderService);
  app.register(realtimeServiceOrderService.routes)

  await app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
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
}
bootstrap();

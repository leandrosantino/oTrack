import 'fastify';
import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TokenData } from 'services/AuthService/IAuthServiceDTO';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenData;
  }
}

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>

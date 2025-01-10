import 'fastify';
import { TokenData } from 'services/AuthService/IAuthServiceDTO';

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenData;
  }
}

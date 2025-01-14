import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "services/AuthService/IAuthService";

@injectable()
export class ErrorMiddleware {

  constructor(
    @inject('AuthService') private readonly authService: IAuthService
  ) { }

  async build(error: any, request: FastifyRequest, reply: FastifyReply) {
    console.log('assss', error)
    if (error.validation && error.code === 'FST_ERR_VALIDATION') {
      reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation error',
        details: error.validation.map((err: any) => ({
          path: err.instancePath || err.params.missingProperty,
          message: err.message,
        })),
      });
    } else {
      reply.send(error);
    }
  }


}

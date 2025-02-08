import { FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "interfaces/Logger";
import { inject, injectable } from "tsyringe";

@injectable()
export class ErrorMiddleware {

  constructor(
    @inject('Logger') private readonly logger: Logger
  ) { }

  build() {
    return async (error: any, request: FastifyRequest, reply: FastifyReply) => {
      if (error.validation && error.code === 'FST_ERR_VALIDATION') {
        reply.status(400).send({
          message: 'Schema validation error',
          type: 'VALIDATION_ERROR',
          details: error.validation.map((err: any) => ({
            path: err.instancePath || err.params.missingProperty,
            message: err.message,
          })),
        });
        return
      }

      this.logger.error('Unexpected internal server error: ' + error.message)

      reply.status(500).send({
        message: 'Unexpected internal server error',
        type: 'INTERNAL_ERROR'
      })

    }
  }


}

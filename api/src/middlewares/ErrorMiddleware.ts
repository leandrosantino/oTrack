import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class ErrorMiddleware {

  async build(error: any, request: FastifyRequest, reply: FastifyReply) {
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

    reply.status(500).send({
      message: 'Unexpected internal server error',
      type: 'INTERNAL_ERROR'
    })

  }


}

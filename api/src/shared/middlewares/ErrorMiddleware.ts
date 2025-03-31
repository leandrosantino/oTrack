import { FastifyReply, FastifyRequest } from "fastify";
import { ApplicationException } from "shared/exceptions/ApplicationException";
import { Logger } from "shared/Logging/Logger";
import { ValidationException } from "shared/Validator/ValidatorException";
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
          ...new ValidationException.InvalidData().details(),
          details: error.validation.map((err: any) => ({
            path: err.instancePath || err.params.missingProperty,
            message: err.message,
          })),
        });
        return
      }

      const internalErrorException = new ApplicationException.InternalError()
      this.logger.error(internalErrorException.message + ': ' + error.message + error.stack)
      reply.status(500).send(internalErrorException.details())

    }
  }


}

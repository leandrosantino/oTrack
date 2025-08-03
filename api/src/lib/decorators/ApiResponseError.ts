import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Exception } from 'lib/utils/Exception';

export function ApiResponseError<T extends Exception>(status: number, ExceptionClass: new (...args: any[]) => T) {
  const exception = new ExceptionClass().details()
  return applyDecorators(
    ApiResponse({
      status,
      description: exception.message,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          type: {
            type: 'string'
          }
        },
        required: [
          'message', 'type'
        ],
        example: exception
      }
    })
  )
}

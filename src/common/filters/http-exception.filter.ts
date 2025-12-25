import { ApiErrorResponse } from './../types/api-error-type.js';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODE, type ErrorCode } from '../types/error-code.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCode = ERROR_CODE.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;

        const rawMessage = r.message;
        const rawError = r.error;

        // message
        if (typeof rawMessage === 'string') {
          message = rawMessage;
          details = null; // 중복 방지
        } else if (Array.isArray(rawMessage)) {
          // ValidationPipe 케이스
          message = typeof rawError === 'string' ? rawError : 'Bad request';
          details = rawMessage;
        } else if (typeof rawMessage === 'object' && rawMessage !== null) {
          message = typeof rawError === 'string' ? rawError : 'Bad request';
          details = rawMessage;
        } else {
          // message가 없거나 예상 못한 타입이면 error 필드 활용
          message = typeof rawError === 'string' ? rawError : message;
          details = null;
        }
      }

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = ERROR_CODE.BAD_REQUEST;
          break;
        case HttpStatus.UNAUTHORIZED:
          code = ERROR_CODE.UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          code = ERROR_CODE.FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          code = ERROR_CODE.NOT_FOUND;
          break;
        default:
          code = ERROR_CODE.INTERNAL_SERVER_ERROR;
      }
    }

    const body: ApiErrorResponse = {
      ok: false,
      error: { code, message, details },
    };

    response.status(status).json(body);
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<{
      status: (statusCode: number) => {
        json: (body: { statusCode: number; message: string }) => void;
      };
    }>();
    const errorCode =
      'code' in exception.driverError &&
      typeof exception.driverError.code === 'string'
        ? exception.driverError.code
        : undefined;
    const errorResponses: Record<
      string,
      { statusCode: number; message: string }
    > = {
      ER_ROW_IS_REFERENCED_2: {
        statusCode: HttpStatus.CONFLICT,
        message: 'No se puede eliminar porque tiene registros relacionados',
      },
      ER_DUP_ENTRY: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Ya existe un registro con esos datos',
      },
      ER_NO_REFERENCED_ROW_2: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Una de las referencias indicadas no existe',
      },
    };
    const errorResponse =
      errorCode && Object.hasOwn(errorResponses, errorCode)
        ? errorResponses[errorCode]
        : undefined;
    const statusCode = errorResponse?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = errorResponse?.message ?? 'Error interno del servidor';

    response.status(statusCode).json({ statusCode, message });
  }
}

import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { QueryFailedFilter } from './query-failed.filter';

describe('QueryFailedFilter', () => {
  const filter = new QueryFailedFilter();

  it.each([
    [
      'ER_ROW_IS_REFERENCED_2',
      HttpStatus.CONFLICT,
      'No se puede eliminar porque tiene registros relacionados',
    ],
    [
      'ER_DUP_ENTRY',
      HttpStatus.CONFLICT,
      'Ya existe un registro con esos datos',
    ],
    [
      'ER_NO_REFERENCED_ROW_2',
      HttpStatus.BAD_REQUEST,
      'Una de las referencias indicadas no existe',
    ],
    ['ER_UNKNOWN_ERROR', HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'],
  ])('maps %s to its HTTP response', (code, statusCode, message) => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
    const driverError = Object.assign(new Error('database error'), { code });
    const exception = new QueryFailedError('query', [], driverError);

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(statusCode);
    expect(json).toHaveBeenCalledWith({ statusCode, message });
  });
});

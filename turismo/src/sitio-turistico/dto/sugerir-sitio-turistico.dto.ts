import { OmitType } from '@nestjs/swagger';
import { CreateSitioTuristicoDto } from './create-sitio-turistico.dto';

// El usuario no puede asignar el estado administrativo al sugerir un sitio.
export class SugerirSitioTuristicoDto extends OmitType(
  CreateSitioTuristicoDto,
  ['estado'] as const,
) {}

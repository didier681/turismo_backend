import { PartialType } from '@nestjs/swagger';
import { CreateSitioTuristicoDto } from './create-sitio-turistico.dto';

// Permite modificar parcialmente los datos de un sitio turístico.
export class UpdateSitioTuristicoDto extends PartialType(
  CreateSitioTuristicoDto,
) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaNegocioDto } from './create-categoria-negocio.dto';

// Permite actualizar parcialmente una categoría de negocio.
export class UpdateCategoriaNegocioDto extends PartialType(
  CreateCategoriaNegocioDto,
) {}

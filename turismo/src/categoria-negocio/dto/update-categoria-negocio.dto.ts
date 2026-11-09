import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaNegocioDto } from './create-categoria-negocio.dto';

// Permite actualizar parcialmente una categoría de negocio.
export class UpdateCategoriaNegocioDto extends PartialType(
  CreateCategoriaNegocioDto,
) {}

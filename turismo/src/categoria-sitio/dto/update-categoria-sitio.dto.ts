import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaSitioDto } from './create-categoria-sitio.dto';

// Permite cambiar de forma parcial el nombre o icono de la categoría.
export class UpdateCategoriaSitioDto extends PartialType(
  CreateCategoriaSitioDto,
) {}

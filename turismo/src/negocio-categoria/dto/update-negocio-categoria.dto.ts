import { PartialType } from '@nestjs/mapped-types';
import { CreateNegocioCategoriaDto } from './create-negocio-categoria.dto';

// Permite cambiar parcialmente las claves de la asociación.
export class UpdateNegocioCategoriaDto extends PartialType(
  CreateNegocioCategoriaDto,
) {}

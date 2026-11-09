import { PartialType } from '@nestjs/swagger';
import { CreateNegocioCategoriaDto } from './create-negocio-categoria.dto';

// Permite cambiar parcialmente las claves de la asociación.
export class UpdateNegocioCategoriaDto extends PartialType(
  CreateNegocioCategoriaDto,
) {}

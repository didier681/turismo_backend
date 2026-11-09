import { PartialType } from '@nestjs/swagger';
import { CreateSitioCategoriaDto } from './create-sitio-categoria.dto';

// Permite reemplazar cualquiera de las claves de la asociación.
export class UpdateSitioCategoriaDto extends PartialType(
  CreateSitioCategoriaDto,
) {}

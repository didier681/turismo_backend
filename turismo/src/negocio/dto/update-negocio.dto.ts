import { PartialType } from '@nestjs/mapped-types';
import { CreateNegocioDto } from './create-negocio.dto';

// Permite modificar parcialmente los datos validados de un negocio.
export class UpdateNegocioDto extends PartialType(CreateNegocioDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateNegocioDto } from './create-negocio.dto';

// Permite modificar parcialmente los datos validados de un negocio.
export class UpdateNegocioDto extends PartialType(CreateNegocioDto) {}

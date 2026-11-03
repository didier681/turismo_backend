import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioDto } from './create-servicio.dto';

// Permite actualizar parcialmente los datos validados de un servicio.
export class UpdateServicioDto extends PartialType(CreateServicioDto) {}

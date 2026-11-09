import { PartialType } from '@nestjs/swagger';
import { CreateServicioDto } from './create-servicio.dto';

// Permite actualizar parcialmente los datos validados de un servicio.
export class UpdateServicioDto extends PartialType(CreateServicioDto) {}

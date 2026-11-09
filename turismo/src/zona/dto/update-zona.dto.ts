import { PartialType } from '@nestjs/swagger';
import { CreateZonaDto } from './create-zona.dto';

// Datos parciales permitidos al modificar una zona.
export class UpdateZonaDto extends PartialType(CreateZonaDto) {}

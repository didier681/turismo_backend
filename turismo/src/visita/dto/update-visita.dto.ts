import { PartialType } from '@nestjs/swagger';
import { CreateVisitaDto } from './create-visita.dto';

// Campos opcionales para corregir los datos de una visita existente.
export class UpdateVisitaDto extends PartialType(CreateVisitaDto) {}

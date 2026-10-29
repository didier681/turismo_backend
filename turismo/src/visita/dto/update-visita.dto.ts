import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitaDto } from './create-visita.dto';

// Campos opcionales para corregir los datos de una visita existente.
export class UpdateVisitaDto extends PartialType(CreateVisitaDto) {}

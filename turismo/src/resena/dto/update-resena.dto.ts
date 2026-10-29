import { PartialType } from '@nestjs/mapped-types';
import { CreateResenaDto } from './create-resena.dto';

// Campos opcionales para modificar una reseña existente.
export class UpdateResenaDto extends PartialType(CreateResenaDto) {}

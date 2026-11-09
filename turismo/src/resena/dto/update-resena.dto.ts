import { PartialType } from '@nestjs/swagger';
import { CreateResenaDto } from './create-resena.dto';

// Campos opcionales para modificar una reseña existente.
export class UpdateResenaDto extends PartialType(CreateResenaDto) {}

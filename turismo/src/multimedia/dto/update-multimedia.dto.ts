import { PartialType } from '@nestjs/swagger';
import { CreateMultimediaDto } from './create-multimedia.dto';

// Permite actualizar parcialmente el contenido sin omitir sus validaciones.
export class UpdateMultimediaDto extends PartialType(CreateMultimediaDto) {}

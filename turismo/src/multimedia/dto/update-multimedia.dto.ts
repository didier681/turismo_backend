import { PartialType } from '@nestjs/mapped-types';
import { CreateMultimediaDto } from './create-multimedia.dto';

// Permite actualizar parcialmente el contenido sin omitir sus validaciones.
export class UpdateMultimediaDto extends PartialType(CreateMultimediaDto) {}

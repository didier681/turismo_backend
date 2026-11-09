import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

// Identificadores de las zonas que se asignarán al gestor.
export class AssignGestorZonasDto {
  @ApiProperty({
    description: 'Identificadores de las zonas que se asignarán.',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  idZonas: number[];
}

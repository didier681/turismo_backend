import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Datos de entrada de una reseña; la calificación queda limitada de 1 a 5.
export class CreateResenaDto {
  @ApiProperty({
    description: 'Identificador del sitio turístico reseñado.',
    example: 4,
  })
  @IsInt()
  @Min(1)
  idSitio: number;

  @ApiProperty({
    description: 'Calificación otorgada al sitio, entre 1 y 5.',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @ApiProperty({
    description: 'Comentario escrito por el usuario sobre el sitio.',
    example: 'Un lugar muy agradable para visitar en familia.',
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;
}

import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

// Datos de entrada de una reseña; la calificación queda limitada de 1 a 5.
export class CreateResenaDto {
  @IsInt()
  @Min(1)
  idUsuario: number;

  @IsInt()
  @Min(1)
  idSitio: number;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsString()
  @IsNotEmpty()
  comentario: string;
}

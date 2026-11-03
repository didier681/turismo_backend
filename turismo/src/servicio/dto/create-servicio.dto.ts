import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos requeridos para registrar un servicio en un negocio existente.
export class CreateServicioDto {
  // Exige un identificador entero positivo para el negocio.
  @IsInt()
  @Min(1)
  idNegocio: number;

  // Exige un nombre de texto no vacío con un máximo de 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  // Exige que la descripción sea texto no vacío.
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  // Exige disponibilidad textual no vacía de hasta 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  disponibilidad: string;
}

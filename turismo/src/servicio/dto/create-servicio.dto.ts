import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos requeridos para registrar un servicio en un negocio existente.
export class CreateServicioDto {
  @IsInt()
  @Min(1)
  idNegocio: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  disponibilidad: string;
}

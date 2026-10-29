import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

// Datos requeridos para crear una categoría de sitio.
export class CreateCategoriaSitioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  icono: string;
}

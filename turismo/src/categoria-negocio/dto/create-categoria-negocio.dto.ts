import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Datos obligatorios para registrar una categoría de negocio.
export class CreateCategoriaNegocioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;
}

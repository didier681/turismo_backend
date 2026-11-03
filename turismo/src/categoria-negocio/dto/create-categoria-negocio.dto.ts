import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Datos obligatorios para registrar una categoría de negocio.
export class CreateCategoriaNegocioDto {
  // Exige un nombre de texto no vacío con un máximo de 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;
}

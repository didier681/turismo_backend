import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Datos obligatorios para registrar una categoría de negocio.
export class CreateCategoriaNegocioDto {
  @ApiProperty({
    description: 'Nombre descriptivo de la categoría de negocio.',
    example: 'Restaurante',
  })
  // Exige un nombre de texto no vacío con un máximo de 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;
}

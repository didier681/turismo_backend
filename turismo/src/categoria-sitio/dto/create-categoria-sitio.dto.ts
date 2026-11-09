import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Datos requeridos para crear una categoría de sitio.
export class CreateCategoriaSitioDto {
  @ApiProperty({
    description: 'Nombre descriptivo de la categoría del sitio.',
    example: 'Parque natural',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Nombre o identificador del icono de la categoría.',
    example: 'tree',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  icono: string;
}

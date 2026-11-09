import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Datos requeridos para registrar un servicio en un negocio existente.
export class CreateServicioDto {
  @ApiProperty({
    description: 'Identificador del negocio que ofrece el servicio.',
    example: 1,
  })
  // Exige un identificador entero positivo para el negocio.
  @IsInt()
  @Min(1)
  idNegocio: number;

  @ApiProperty({
    description: 'Nombre con el que se presenta el servicio.',
    example: 'Recorrido guiado',
  })
  // Exige un nombre de texto no vacío con un máximo de 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio ofrecido.',
    example: 'Recorrido guiado por los principales atractivos turísticos.',
  })
  // Exige que la descripción sea texto no vacío.
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Texto que indica los días u horarios de disponibilidad.',
    example: 'Lunes a domingo, de 9:00 a 17:00',
  })
  // Exige disponibilidad textual no vacía de hasta 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  disponibilidad: string;
}

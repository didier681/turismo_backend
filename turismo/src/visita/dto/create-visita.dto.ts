import {
  IsInt,
  IsLatitude,
  IsLongitude,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Datos de entrada para registrar la visita del usuario autenticado.
export class CreateVisitaDto {
  @ApiProperty({
    description: 'Identificador de la zona geográfica de la visita.',
    example: 2,
  })
  @IsInt()
  @Min(1)
  idZona: number;

  @ApiProperty({
    description: 'Identificador del sitio turístico visitado.',
    example: 5,
  })
  @IsInt()
  @Min(1)
  idSitio: number;

  @ApiProperty({
    description: 'Latitud registrada para la ubicación de la visita.',
    example: '8.7500000',
  })
  @IsLatitude()
  latitud: string;

  @ApiProperty({
    description: 'Longitud registrada para la ubicación de la visita.',
    example: '-75.8833000',
  })
  @IsLongitude()
  longitud: string;
}

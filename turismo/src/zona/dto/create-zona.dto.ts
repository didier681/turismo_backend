import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoZona } from '../entities/zona.entity';

// Datos permitidos y validados para crear una zona geográfica.
export class CreateZonaDto {
  @ApiProperty({
    description: 'Nombre de la zona geográfica.',
    example: 'Montería',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Tipo de división geográfica de la zona.',
    enum: TipoZona,
    example: TipoZona.Ciudad,
  })
  @IsEnum(TipoZona)
  tipo: TipoZona;

  @ApiProperty({
    description: 'Latitud del centro geográfico de la zona.',
    example: '8.7500',
  })
  @IsLatitude()
  latitud: string;

  @ApiProperty({
    description: 'Longitud del centro geográfico de la zona.',
    example: '-75.8833',
  })
  @IsLongitude()
  longitud: string;

  @ApiProperty({
    description: 'Radio de cobertura de la zona en metros.',
    example: 15000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Max(2147483647)
  radioCoberturaM: number;
}

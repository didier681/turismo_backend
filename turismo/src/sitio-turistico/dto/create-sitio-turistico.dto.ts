import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoSitio } from '../entities/sitio-turistico.entity';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// Datos requeridos y validados para registrar un sitio turístico.
export class CreateSitioTuristicoDto {
  @ApiProperty({
    description: 'Identificador de la zona a la que pertenece el sitio.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  idZona: number;

  @ApiProperty({
    description: 'Nombre del sitio turístico.',
    example: 'Ronda del Sinú',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del sitio turístico.',
    example: 'Parque lineal junto al río Sinú.',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Latitud geográfica del sitio en grados decimales.',
    example: '8.7500000',
  })
  @IsLatitude()
  latitud: string;

  @ApiProperty({
    description: 'Longitud geográfica del sitio en grados decimales.',
    example: '-75.8833000',
  })
  @IsLongitude()
  longitud: string;

  @ApiProperty({
    description: 'Hora de apertura en formato HH:mm o HH:mm:ss.',
    example: '06:00',
  })
  @IsString()
  @Matches(TIME_PATTERN)
  horarioApertura: string;

  @ApiProperty({
    description: 'Hora de cierre en formato HH:mm o HH:mm:ss.',
    example: '22:00',
  })
  @IsString()
  @Matches(TIME_PATTERN)
  horarioCierre: string;

  @ApiProperty({
    description: 'Estado del sitio; si se omite, queda activo.',
    enum: EstadoSitio,
    example: EstadoSitio.Activo,
    required: false,
  })
  @IsEnum(EstadoSitio)
  @IsOptional()
  estado?: EstadoSitio;
}

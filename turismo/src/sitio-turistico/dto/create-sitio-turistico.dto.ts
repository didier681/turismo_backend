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
import { EstadoSitio } from '../entities/sitio-turistico.entity';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// Datos requeridos y validados para registrar un sitio turístico.
export class CreateSitioTuristicoDto {
  @IsInt()
  @Min(1)
  idZona: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsLatitude()
  latitud: string;

  @IsLongitude()
  longitud: string;

  @IsString()
  @Matches(TIME_PATTERN)
  horarioApertura: string;

  @IsString()
  @Matches(TIME_PATTERN)
  horarioCierre: string;

  @IsEnum(EstadoSitio)
  @IsOptional()
  estado?: EstadoSitio;
}

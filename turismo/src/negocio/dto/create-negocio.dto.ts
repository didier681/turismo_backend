import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoMembresia } from '../entities/negocio.entity';

// Datos validados para registrar un negocio asociado a un sitio existente.
export class CreateNegocioDto {
  @IsInt()
  @Min(1)
  idSitio: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreComercial: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nitDocumento: string;

  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  latitud: number;

  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  longitud: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsEnum(EstadoMembresia)
  @IsOptional()
  estadoMembresia?: EstadoMembresia;
}

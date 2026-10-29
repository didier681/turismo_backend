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
import { TipoZona } from '../entities/zona.entity';

// Datos permitidos y validados para crear una zona geográfica.
export class CreateZonaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsEnum(TipoZona)
  tipo: TipoZona;

  @IsLatitude()
  latitud: string;

  @IsLongitude()
  longitud: string;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  radioCoberturaM: number;
}

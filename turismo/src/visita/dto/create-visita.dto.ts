import {
  IsInt,
  IsLatitude,
  IsLongitude,
  Min,
} from 'class-validator';

// Datos de entrada para registrar quién visitó qué sitio y dónde.
export class CreateVisitaDto {
  @IsInt()
  @Min(1)
  idUsuario: number;

  @IsInt()
  @Min(1)
  idZona: number;

  @IsInt()
  @Min(1)
  idSitio: number;

  @IsLatitude()
  latitud: string;

  @IsLongitude()
  longitud: string;
}

import { IsInt, Min } from 'class-validator';

// Identifica el usuario y el sitio que se guardará como favorito.
export class CreateFavoritoDto {
  @IsInt()
  @Min(1)
  idUsuario: number;

  @IsInt()
  @Min(1)
  idSitio: number;
}

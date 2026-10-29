import { IsInt, Min } from 'class-validator';

// Claves de sitio y categoría que forman la asociación N:M.
export class CreateSitioCategoriaDto {
  @IsInt()
  @Min(1)
  idSitio: number;

  @IsInt()
  @Min(1)
  idCategoria: number;
}

import { IsInt, Min } from 'class-validator';

// Claves de negocio y categoría que forman la asociación N:M.
export class CreateNegocioCategoriaDto {
  @IsInt()
  @Min(1)
  idNegocio: number;

  @IsInt()
  @Min(1)
  idCategoriaNeg: number;
}

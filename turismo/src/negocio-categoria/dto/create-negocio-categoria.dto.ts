import { IsInt, Min } from 'class-validator';

// Claves de negocio y categoría que forman la asociación N:M.
export class CreateNegocioCategoriaDto {
  // Exige el identificador entero positivo del negocio.
  @IsInt()
  @Min(1)
  idNegocio: number;

  // Exige el identificador entero positivo de la categoría.
  @IsInt()
  @Min(1)
  idCategoriaNeg: number;
}

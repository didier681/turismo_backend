import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Claves de negocio y categoría que forman la asociación N:M.
export class CreateNegocioCategoriaDto {
  @ApiProperty({
    description: 'Identificador del negocio que se asociará.',
    example: 1,
  })
  // Exige el identificador entero positivo del negocio.
  @IsInt()
  @Min(1)
  idNegocio: number;

  @ApiProperty({
    description: 'Identificador de la categoría que se asociará al negocio.',
    example: 2,
  })
  // Exige el identificador entero positivo de la categoría.
  @IsInt()
  @Min(1)
  idCategoriaNeg: number;
}

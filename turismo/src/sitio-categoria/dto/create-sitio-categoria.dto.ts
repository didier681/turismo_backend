import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Claves de sitio y categoría que forman la asociación N:M.
export class CreateSitioCategoriaDto {
  @ApiProperty({
    description: 'Identificador del sitio turístico que se asociará.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  idSitio: number;

  @ApiProperty({
    description: 'Identificador de la categoría que se asociará al sitio.',
    example: 2,
  })
  @IsInt()
  @Min(1)
  idCategoria: number;
}

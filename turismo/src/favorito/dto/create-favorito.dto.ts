import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Identifica el sitio que se guardará como favorito del usuario autenticado.
export class CreateFavoritoDto {
  @ApiProperty({
    description: 'Identificador del sitio turístico guardado como favorito.',
    example: 3,
  })
  @IsInt()
  @Min(1)
  idSitio: number;
}

import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Identifica el usuario y el sitio que se guardará como favorito.
export class CreateFavoritoDto {
  @ApiProperty({
    description: 'Identificador del usuario que guarda el favorito.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  idUsuario: number;

  @ApiProperty({
    description: 'Identificador del sitio turístico guardado como favorito.',
    example: 3,
  })
  @IsInt()
  @Min(1)
  idSitio: number;
}

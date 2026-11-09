import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  TipoContenidoMultimedia,
  TipoEntidadMultimedia,
} from '../entities/multimedia.entity';

// Datos validados para registrar contenido multimedia.
export class CreateMultimediaDto {
  // Restringe el tipo de entidad a sitio o negocio.
  @ApiProperty({
    description: 'Tipo de entidad a la que pertenece el contenido.',
    enum: TipoEntidadMultimedia,
    example: TipoEntidadMultimedia.Sitio,
  })
  @IsEnum(TipoEntidadMultimedia)
  tipoEntidad: TipoEntidadMultimedia;

  @ApiProperty({
    description: 'Identificador de la entidad seleccionada en tipoEntidad.',
    example: 1,
  })
  // Exige un identificador entero positivo para la entidad asociada.
  @IsInt()
  @Min(1)
  idEntidad: number;

  @ApiProperty({
    description: 'Formato del contenido que se registra.',
    enum: TipoContenidoMultimedia,
    example: TipoContenidoMultimedia.Imagen,
  })
  // Restringe el formato a texto, imagen o video.
  @IsEnum(TipoContenidoMultimedia)
  tipoContenido: TipoContenidoMultimedia;

  @ApiProperty({
    description: 'URL del recurso; requerida para contenido de tipo imagen o video.',
    example: 'https://ejemplo.com/imagen.jpg',
    required: false,
    nullable: true,
  })
  // Permite omitir la URL; si se proporciona, debe tener formato válido.
  @IsUrl()
  @MaxLength(2048)
  @IsOptional()
  urlContenido?: string | null;

  @ApiProperty({
    description: 'Texto del contenido; requerido cuando tipoContenido es texto.',
    example: 'Bienvenidos a la Ronda del Sinú.',
    required: false,
    nullable: true,
  })
  // Permite omitir el texto; su obligatoriedad depende del tipo de contenido.
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  textoContenido?: string | null;

  @ApiProperty({
    description: 'Posición en la que se presenta el contenido.',
    example: 1,
    minimum: 0,
  })
  // Exige un entero no negativo que define el orden de presentación.
  @IsInt()
  @Min(0)
  orden: number;
}

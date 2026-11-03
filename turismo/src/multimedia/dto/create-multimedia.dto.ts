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
import {
  TipoContenidoMultimedia,
  TipoEntidadMultimedia,
} from '../entities/multimedia.entity';

// Datos validados para registrar contenido multimedia.
export class CreateMultimediaDto {
  // Restringe el tipo de entidad a sitio o negocio.
  @IsEnum(TipoEntidadMultimedia)
  tipoEntidad: TipoEntidadMultimedia;

  // Exige un identificador entero positivo para la entidad asociada.
  @IsInt()
  @Min(1)
  idEntidad: number;

  // Restringe el formato a texto, imagen o video.
  @IsEnum(TipoContenidoMultimedia)
  tipoContenido: TipoContenidoMultimedia;

  // Permite omitir la URL; si se proporciona, debe tener formato válido.
  @IsUrl()
  @MaxLength(2048)
  @IsOptional()
  urlContenido?: string | null;

  // Permite omitir el texto; su obligatoriedad depende del tipo de contenido.
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  textoContenido?: string | null;

  // Exige un entero no negativo que define el orden de presentación.
  @IsInt()
  @Min(0)
  orden: number;
}

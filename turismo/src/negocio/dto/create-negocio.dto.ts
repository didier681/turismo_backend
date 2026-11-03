import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoMembresia } from '../entities/negocio.entity';

// Datos validados para registrar un negocio que siempre pertenece a una zona.
export class CreateNegocioDto {
  // Exige el identificador entero positivo de la zona obligatoria del negocio.
  @IsInt()
  @Min(1)
  idZona: number;

  // El sitio turístico es opcional; si se envía, su identificador debe ser positivo.
  @IsInt()
  @Min(1)
  @IsOptional()
  idSitio?: number | null;

  // Exige un nombre comercial de texto no vacío de hasta 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreComercial: string;

  // Exige un documento de texto no vacío de hasta 50 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nitDocumento: string;

  // Valida que la latitud sea numérica, tenga hasta 7 decimales y esté en rango.
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  latitud: number;

  // Valida que la longitud sea numérica, tenga hasta 7 decimales y esté en rango.
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  longitud: number;

  // Exige un teléfono de texto no vacío de hasta 30 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  // Comprueba el formato de correo y limita su longitud a 255 caracteres.
  @IsEmail()
  @MaxLength(255)
  email: string;

  // Si se proporciona, restringe la membresía a los valores del enum.
  @IsEnum(EstadoMembresia)
  @IsOptional()
  estadoMembresia?: EstadoMembresia;
}

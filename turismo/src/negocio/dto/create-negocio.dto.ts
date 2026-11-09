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
import { ApiProperty } from '@nestjs/swagger';
import { EstadoMembresia } from '../entities/negocio.entity';

// Datos validados para registrar un negocio que siempre pertenece a una zona.
export class CreateNegocioDto {
  @ApiProperty({
    description: 'Identificador de la zona obligatoria a la que pertenece el negocio.',
    example: 1,
  })
  // Exige el identificador entero positivo de la zona obligatoria del negocio.
  @IsInt()
  @Min(1)
  idZona: number;

  @ApiProperty({
    description: 'Identificador opcional del sitio turístico asociado, que debe pertenecer a la misma zona.',
    example: 1,
    required: false,
    nullable: true,
  })
  // El sitio turístico es opcional; si se envía, su identificador debe ser positivo.
  @IsInt()
  @Min(1)
  @IsOptional()
  idSitio?: number | null;

  @ApiProperty({
    description: 'Nombre comercial con el que se identifica el negocio.',
    example: 'Restaurante del Río',
  })
  // Exige un nombre comercial de texto no vacío de hasta 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreComercial: string;

  @ApiProperty({
    description: 'NIT u otro documento de identificación del negocio.',
    example: '900123456-7',
  })
  // Exige un documento de texto no vacío de hasta 50 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nitDocumento: string;

  @ApiProperty({
    description: 'Latitud geográfica del negocio en grados decimales.',
    example: 8.7501,
  })
  // Valida que la latitud sea numérica, tenga hasta 7 decimales y esté en rango.
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  latitud: number;

  @ApiProperty({
    description: 'Longitud geográfica del negocio en grados decimales.',
    example: -75.8834,
  })
  // Valida que la longitud sea numérica, tenga hasta 7 decimales y esté en rango.
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  longitud: number;

  @ApiProperty({
    description: 'Teléfono de contacto del negocio.',
    example: '6041234567',
  })
  // Exige un teléfono de texto no vacío de hasta 30 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto del negocio.',
    example: 'contacto@restaurante.com',
  })
  // Comprueba el formato de correo y limita su longitud a 255 caracteres.
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Nivel de membresía; si se omite, el valor predeterminado es gratis.',
    enum: EstadoMembresia,
    example: EstadoMembresia.Gratis,
    required: false,
  })
  // Si se proporciona, restringe la membresía a los valores del enum.
  @IsEnum(EstadoMembresia)
  @IsOptional()
  estadoMembresia?: EstadoMembresia;
}

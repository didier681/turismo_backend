import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Matches,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EstadoPublicidad,
  TipoPlanPublicidad,
} from '../entities/publicidad.entity';

// Datos validados para crear una publicidad de negocio.
export class CreatePublicidadDto {
  // Exige la clave entera positiva del negocio anunciante.
  @ApiProperty({
    description: 'Identificador del negocio responsable de la publicidad.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  idNegocio: number;

  // Permite omitir el sitio; si se indica, su clave debe ser positiva.
  @ApiProperty({
    description: 'Identificador opcional del sitio turístico asociado.',
    example: 2,
    required: false,
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  idSitioAsociado?: number | null;

  // Restringe el plan a las opciones permitidas.
  @ApiProperty({
    description: 'Plan contratado para la campaña publicitaria.',
    enum: TipoPlanPublicidad,
    example: TipoPlanPublicidad.Basico,
  })
  @IsEnum(TipoPlanPublicidad)
  tipoPlan: TipoPlanPublicidad;

  // Exige un presupuesto finito; el mínimo depende del plan y se valida en servicio.
  @ApiProperty({
    description: 'Presupuesto de la campaña; el mínimo depende del plan.',
    example: 150000,
    minimum: 0,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  @Max(99999999.99)
  presupuesto: number;

  // Exige una fecha ISO válida para el inicio de la campaña.
  @ApiProperty({
    description: 'Fecha de inicio de la campaña en formato AAAA-MM-DD.',
    example: '2026-11-03',
  })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaIni: string;

  // Exige una fecha ISO válida posterior al inicio, comprobada en el servicio.
  @ApiProperty({
    description: 'Fecha de finalización posterior al inicio, en formato AAAA-MM-DD.',
    example: '2026-12-31',
  })
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaFin: string;

  // Si se proporciona, restringe el estado a los valores permitidos.
  @ApiProperty({
    description: 'Estado actual de la publicidad; por defecto queda activa.',
    enum: EstadoPublicidad,
    example: EstadoPublicidad.Activo,
    required: false,
  })
  @IsEnum(EstadoPublicidad)
  @IsOptional()
  estado?: EstadoPublicidad;
}

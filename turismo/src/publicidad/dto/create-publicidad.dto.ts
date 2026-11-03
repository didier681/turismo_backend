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
import {
  EstadoPublicidad,
  TipoPlanPublicidad,
} from '../entities/publicidad.entity';

// Datos validados para crear una publicidad de negocio.
export class CreatePublicidadDto {
  // Exige la clave entera positiva del negocio anunciante.
  @IsInt()
  @Min(1)
  idNegocio: number;

  // Permite omitir el sitio; si se indica, su clave debe ser positiva.
  @IsInt()
  @Min(1)
  @IsOptional()
  idSitioAsociado?: number | null;

  // Restringe el plan a las opciones permitidas.
  @IsEnum(TipoPlanPublicidad)
  tipoPlan: TipoPlanPublicidad;

  // Exige un presupuesto no negativo, finito y de hasta dos decimales.
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Max(99999999.99)
  presupuesto: number;

  // Exige una fecha ISO válida para el inicio de la campaña.
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaIni: string;

  // Exige una fecha ISO válida posterior al inicio, comprobada en el servicio.
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fechaFin: string;

  // Si se proporciona, restringe el estado a los valores permitidos.
  @IsEnum(EstadoPublicidad)
  @IsOptional()
  estado?: EstadoPublicidad;
}

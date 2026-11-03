import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsPositive,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UnidadTarifa } from '../entities/tarifa.entity';

interface VigenciaDto {
  vigenciaIni?: string;
}

@ValidatorConstraint({ name: 'vigenciaFinPosterior', async: false })
class VigenciaFinPosteriorConstraint implements ValidatorConstraintInterface {
  // Comprueba la vigencia final cuando ambas fechas están presentes.
  validate(value: unknown, args: ValidationArguments): boolean {
    const { vigenciaIni } = args.object as VigenciaDto;
    if (typeof value !== 'string' || typeof vigenciaIni !== 'string') {
      return true;
    }
    return Date.parse(value) >= Date.parse(vigenciaIni);
  }

  defaultMessage(): string {
    return 'vigenciaFin debe ser igual o posterior a vigenciaIni';
  }
}

// Datos requeridos y validados para registrar una tarifa de servicio.
export class CreateTarifaDto {
  @IsInt()
  @Min(1)
  idServicio: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreTarifa: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @Max(99999999.99)
  precio: number;

  @IsString()
  @Length(3, 3)
  @IsOptional()
  moneda?: string;

  @IsEnum(UnidadTarifa)
  unidad: UnidadTarifa;

  @IsDateString({ strict: true })
  vigenciaIni: string;

  @IsDateString({ strict: true })
  @Validate(VigenciaFinPosteriorConstraint)
  vigenciaFin: string;
}

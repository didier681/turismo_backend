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

// Estructura mínima necesaria para comparar las fechas en la validación.
interface VigenciaDto {
  vigenciaIni?: string;
}

@ValidatorConstraint({ name: 'vigenciaFinPosterior', async: false })
// Valida que el final del período no sea anterior a su inicio.
class VigenciaFinPosteriorConstraint implements ValidatorConstraintInterface {
  // Comprueba la vigencia final cuando ambas fechas están presentes.
  validate(value: unknown, args: ValidationArguments): boolean {
    const { vigenciaIni } = args.object as VigenciaDto;
    if (typeof value !== 'string' || typeof vigenciaIni !== 'string') {
      return true;
    }
    return Date.parse(value) >= Date.parse(vigenciaIni);
  }

  // Explica el requisito temporal cuando la validación no se cumple.
  defaultMessage(): string {
    return 'vigenciaFin debe ser igual o posterior a vigenciaIni';
  }
}

// Datos requeridos y validados para registrar una tarifa de servicio.
export class CreateTarifaDto {
  // Exige el identificador entero positivo del servicio asociado.
  @IsInt()
  @Min(1)
  idServicio: number;

  // Exige un nombre no vacío de hasta 255 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreTarifa: string;

  // Exige un importe positivo, finito, de hasta dos decimales y dentro del rango decimal.
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @Max(99999999.99)
  precio: number;

  // Permite omitir la moneda; si se indica, debe tener exactamente tres caracteres.
  @IsString()
  @Length(3, 3)
  @IsOptional()
  moneda?: string;

  // Restringe la unidad a las opciones declaradas en el enum.
  @IsEnum(UnidadTarifa)
  unidad: UnidadTarifa;

  // Exige una fecha ISO válida para el inicio de la vigencia.
  @IsDateString({ strict: true })
  vigenciaIni: string;

  // Exige una fecha ISO válida y que no anteceda a la fecha inicial.
  @IsDateString({ strict: true })
  @Validate(VigenciaFinPosteriorConstraint)
  vigenciaFin: string;
}

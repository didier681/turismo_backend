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
import { ApiProperty } from '@nestjs/swagger';
import { UnidadTarifa } from '../entities/tarifa.entity';

// Estructura mínima necesaria para comparar las fechas en la validación.
interface VigenciaDto {
  vigenciaIni?: string;
}

@ValidatorConstraint({ name: 'vigenciaFinPosterior', async: false })
// Valida que la fecha final sea posterior a la inicial.
class VigenciaFinPosteriorConstraint implements ValidatorConstraintInterface {
  // Comprueba la vigencia final cuando ambas fechas están presentes.
  validate(value: unknown, args: ValidationArguments): boolean {
    const { vigenciaIni } = args.object as VigenciaDto;
    if (typeof value !== 'string' || typeof vigenciaIni !== 'string') {
      return true;
    }
    return Date.parse(value) > Date.parse(vigenciaIni);
  }

  // Explica el requisito temporal cuando la validación no se cumple.
  defaultMessage(): string {
    return 'vigenciaFin debe ser posterior a vigenciaIni';
  }
}

// Datos requeridos y validados para registrar una tarifa de servicio.
export class CreateTarifaDto {
  // Exige el identificador entero positivo del servicio asociado.
  @ApiProperty({
    description: 'Identificador del servicio al que pertenece la tarifa.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  idServicio: number;

  // Exige un nombre no vacío de hasta 255 caracteres.
  @ApiProperty({
    description: 'Nombre descriptivo de la tarifa.',
    example: 'Entrada general',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreTarifa: string;

  // Exige un importe positivo, finito, de hasta dos decimales y dentro del rango decimal.
  @ApiProperty({
    description: 'Precio de la tarifa, expresado como un importe mayor que cero.',
    example: 25000,
    minimum: 0.01,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive({ message: 'El precio de la tarifa debe ser mayor a 0' })
  @Max(99999999.99)
  precio: number;

  // Permite omitir la moneda; si se indica, debe tener exactamente tres caracteres.
  @ApiProperty({
    description: 'Código de moneda de tres caracteres; si se omite, se usa COP.',
    example: 'COP',
    required: false,
  })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  moneda?: string;

  // Restringe la unidad a las opciones declaradas en el enum.
  @ApiProperty({
    description: 'Unidad sobre la que se calcula el precio.',
    enum: UnidadTarifa,
    example: UnidadTarifa.Persona,
  })
  @IsEnum(UnidadTarifa)
  unidad: UnidadTarifa;

  // Exige una fecha ISO válida para el inicio de la vigencia.
  @ApiProperty({
    description: 'Fecha desde la que comienza la vigencia, en formato AAAA-MM-DD.',
    example: '2026-11-03',
  })
  @IsDateString({ strict: true })
  vigenciaIni: string;

  // Exige una fecha ISO válida y posterior a la fecha inicial.
  @ApiProperty({
    description: 'Fecha final de vigencia posterior al inicio.',
    example: '2026-12-31',
  })
  @IsDateString({ strict: true })
  @Validate(VigenciaFinPosteriorConstraint)
  vigenciaFin: string;
}

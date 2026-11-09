import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

// Valida los datos permitidos para registrar o crear una cuenta de usuario.
export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico usado para identificar la cuenta.',
    example: 'usuario@ejemplo.com',
  })
  // Comprueba que el correo tenga formato válido.
  @IsEmail({}, { message: 'El email debe ser válido' })
  // Exige que el correo esté presente.
  @IsNotEmpty({ message: 'El email es obligatorio' })
  // Limita el valor para que quepa en la columna varchar del modelo.
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Contraseña de la cuenta; entre 6 y 72 caracteres.',
    example: 'ClaveSegura123',
    minLength: 6,
    maxLength: 72,
  })
  // Rechaza contraseñas que no sean texto.
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  // Establece el mínimo requerido para aceptar la contraseña.
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  // Exige una contraseña para crear la cuenta.
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  // Limita el tamaño soportado por bcrypt y evita entradas excesivas.
  @MaxLength(72, { message: 'La contraseña no puede superar 72 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre de la persona usuaria.',
    example: 'María Pérez',
  })
  // Comprueba que el nombre se reciba como texto.
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  // Impide crear la cuenta sin nombre.
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  // Limita el nombre a la longitud disponible en la columna.
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Idioma preferido; si se omite, se aplica el valor predeterminado.',
    example: 'es',
    required: false,
  })
  // Comprueba que el idioma, si se envía, sea texto.
  @IsString()
  // Permite omitirlo para que la entidad aplique el valor predeterminado.
  @IsOptional()
  // Evita exceder la longitud admitida para la preferencia.
  @MaxLength(10)
  idiomaPref?: string;

  @ApiProperty({
    description: 'Rol de la cuenta; si se omite, se aplica el rol predeterminado.',
    enum: UserRole,
    example: UserRole.Usuario,
    required: false,
  })
  // Acepta únicamente roles definidos por el modelo.
  @IsEnum(UserRole, {
    message: 'El rol debe ser admin, usuario, negocio o gestor',
  })
  // Permite omitirlo para asignar el rol predeterminado.
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Documento de identidad, opcional para turistas.',
    example: '1234567890',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  documentoIdentidad?: string;

  @ApiProperty({
    description: 'URL opcional del soporte entregado por el gestor.',
    example: 'https://ejemplo.com/soporte.pdf',
    required: false,
  })
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  soporteUrl?: string;
}

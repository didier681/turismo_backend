import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

// Valida los datos permitidos para registrar o crear una cuenta de usuario.
export class CreateUserDto {
  // Comprueba que el correo tenga formato válido.
  @IsEmail({}, { message: 'El email debe ser válido' })
  // Exige que el correo esté presente.
  @IsNotEmpty({ message: 'El email es obligatorio' })
  // Limita el valor para que quepa en la columna varchar del modelo.
  @MaxLength(255)
  email: string;

  // Rechaza contraseñas que no sean texto.
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  // Establece el mínimo requerido para aceptar la contraseña.
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  // Exige una contraseña para crear la cuenta.
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  // Limita el tamaño soportado por bcrypt y evita entradas excesivas.
  @MaxLength(72, { message: 'La contraseña no puede superar 72 caracteres' })
  password: string;

  // Comprueba que el nombre se reciba como texto.
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  // Impide crear la cuenta sin nombre.
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  // Limita el nombre a la longitud disponible en la columna.
  @MaxLength(255)
  nombre: string;

  // Comprueba que el idioma, si se envía, sea texto.
  @IsString()
  // Permite omitirlo para que la entidad aplique el valor predeterminado.
  @IsOptional()
  // Evita exceder la longitud admitida para la preferencia.
  @MaxLength(10)
  idiomaPref?: string;

  // Acepta únicamente roles definidos por el modelo.
  @IsEnum(UserRole, { message: 'El rol debe ser admin, usuario o negocio' })
  // Permite omitirlo para asignar el rol predeterminado.
  @IsOptional()
  role?: UserRole;
}

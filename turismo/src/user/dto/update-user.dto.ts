import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/user.entity';

// Permite enviar únicamente los campos que se desean modificar.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Comprueba que el estado de la cuenta sea booleano.
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  // No exige cambiar el estado en cada actualización.
  @IsOptional()
  isActive?: boolean;

  // Impide guardar un rol fuera del enum de la plataforma.
  @IsEnum(UserRole, {
    message: 'El rol debe ser admin, usuario o negocio',
  })
  // Permite actualizar otros campos sin enviar un rol.
  @IsOptional()
  role?: UserRole;
}

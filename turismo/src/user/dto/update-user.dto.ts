import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/user.entity';

// Permite enviar únicamente los campos que se desean modificar.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Impide guardar un rol fuera del enum de la plataforma.
  @IsEnum(UserRole, {
    message: 'El rol debe ser admin, usuario, negocio o gestor',
  })
  // Permite actualizar otros campos sin enviar un rol.
  @IsOptional()
  role?: UserRole;
}

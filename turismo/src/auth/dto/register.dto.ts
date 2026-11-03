import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';

// El registro reutiliza validaciones y no permite que el cliente asigne su rol.
export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}

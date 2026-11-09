import { OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Datos obligatorios para registrar un gestor pendiente de activación.
export class CreateGestorDto extends OmitType(CreateUserDto, [
  'role',
  'documentoIdentidad',
] as const) {
  @ApiProperty({
    description: 'Documento de identidad único del gestor.',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  documentoIdentidad: string;
}

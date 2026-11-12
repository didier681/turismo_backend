import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoMembresia } from '../entities/negocio.entity';

// Valida el único campo que puede modificar el endpoint administrativo de membresía.
export class UpdateMembresiaDto {
  @ApiProperty({ enum: EstadoMembresia, example: EstadoMembresia.Basico })
  // Impide que el endpoint acepte niveles arbitrarios o inyectados.
  @IsEnum(EstadoMembresia)
  estadoMembresia: EstadoMembresia;
}

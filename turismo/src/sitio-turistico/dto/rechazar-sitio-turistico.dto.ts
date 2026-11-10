import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

// El rechazo debe incluir una explicación legible para quien hizo la sugerencia.
export class RechazarSitioTuristicoDto {
  @ApiProperty({
    description: 'Motivo que se comunicará al usuario que sugirió el sitio.',
    example: 'La ubicación indicada no corresponde a un lugar turístico.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  motivoRechazo: string;
}

import { PartialType } from '@nestjs/swagger';
import { CreatePublicidadDto } from './create-publicidad.dto';

// Permite actualizar parcialmente una publicidad sin omitir sus validaciones.
export class UpdatePublicidadDto extends PartialType(CreatePublicidadDto) {}

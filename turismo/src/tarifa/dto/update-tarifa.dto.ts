import { PartialType } from '@nestjs/swagger';
import { CreateTarifaDto } from './create-tarifa.dto';

// Permite modificar parcialmente una tarifa sin omitir sus validaciones.
export class UpdateTarifaDto extends PartialType(CreateTarifaDto) {}

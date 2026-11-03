import { PartialType } from '@nestjs/mapped-types';
import { CreateTarifaDto } from './create-tarifa.dto';

// Permite modificar parcialmente una tarifa sin omitir sus validaciones.
export class UpdateTarifaDto extends PartialType(CreateTarifaDto) {}

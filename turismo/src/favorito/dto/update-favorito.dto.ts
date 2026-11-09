import { PartialType } from '@nestjs/swagger';
import { CreateFavoritoDto } from './create-favorito.dto';

// Permite actualizar parcialmente la pareja usuario-sitio.
export class UpdateFavoritoDto extends PartialType(CreateFavoritoDto) {}

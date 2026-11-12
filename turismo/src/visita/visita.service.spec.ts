import { Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { Zona } from '../zona/entities/zona.entity';
import { Visita } from './entities/visita.entity';
import { VisitaService } from './visita.service';

describe('VisitaService', () => {
  it('lists only visits belonging to the authenticated user', async () => {
    const find = vi.fn().mockResolvedValue([]);
    const service = new VisitaService(
      { find } as unknown as Repository<Visita>,
      {} as Repository<User>,
      {} as Repository<Zona>,
      {} as Repository<SitioTuristico>,
    );

    await service.findMias({ id: 21 } as User);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { idUsuario: 21 } }),
    );
  });
});

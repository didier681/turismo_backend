import { instanceToPlain } from 'class-transformer';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Resena } from '../../resena/entities/resena.entity';
import { Visita } from '../../visita/entities/visita.entity';
import { AuthUser } from '../../auth/interfaces/auth-response.interface';
import { User } from './user.entity';

describe('User serialization', () => {
  const user = Object.assign(new User(), {
    id: 7,
    email: 'persona@example.com',
    documentoIdentidad: '1234567890',
    soporteUrl: 'https://example.com/soporte',
    nombre: 'Persona',
  });

  it('omits email and identity details without an authorized serialization group', () => {
    const serialized = instanceToPlain(user);

    expect(serialized).toMatchObject({ id: 7, nombre: 'Persona' });
    expect(serialized).not.toHaveProperty('email');
    expect(serialized).not.toHaveProperty('documentoIdentidad');
    expect(serialized).not.toHaveProperty('soporteUrl');
  });

  it.each(['admin', 'propio'])(
    'includes personal data only for the %s group',
    (group) => {
      expect(instanceToPlain(user, { groups: [group] })).toMatchObject({
        email: 'persona@example.com',
        documentoIdentidad: '1234567890',
        soporteUrl: 'https://example.com/soporte',
      });
    },
  );

  it('uses the own-user group for personal data in authentication responses', () => {
    const authUser = Object.assign(new AuthUser(), {
      id: 7,
      email: user.email,
      documentoIdentidad: user.documentoIdentidad,
      soporteUrl: user.soporteUrl,
      nombre: user.nombre,
      role: 'usuario',
    });

    expect(instanceToPlain(authUser, { groups: ['propio'] })).toMatchObject({
      email: user.email,
      documentoIdentidad: user.documentoIdentidad,
      soporteUrl: user.soporteUrl,
    });
    expect(instanceToPlain(authUser)).not.toHaveProperty('email');
  });

  it.each([
    ['reseña', () => Object.assign(new Resena(), { usuario: user })],
    ['visita', () => Object.assign(new Visita(), { usuario: user })],
    ['favorito', () => Object.assign(new Favorito(), { usuario: user })],
  ])('limits the author shown in a %s to id and name', (_name, createEntity) => {
    const serialized = instanceToPlain(createEntity());

    expect(serialized).toHaveProperty('usuario', {
      id: 7,
      nombre: 'Persona',
    });
  });
});

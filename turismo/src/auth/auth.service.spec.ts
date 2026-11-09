import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { Zona } from '../zona/entities/zona.entity';

describe('User registration and authentication', () => {
  let authService: AuthService;
  let storedUser: User | null;
  const repository = {
    existsBy: vi.fn(),
    create: vi.fn((values: Partial<User>) => values),
    save: vi.fn(async (user: Partial<User>) => {
      storedUser = {
        ...user,
        id: 1,
        isActive: true,
        fechaRegistro: new Date(),
      } as User;
      return storedUser;
    }),
    findOne: vi.fn(async () => storedUser),
  };
  const jwtService = {
    signAsync: vi.fn().mockResolvedValue('signed-token'),
  };

  beforeEach(async () => {
    storedUser = null;
    vi.clearAllMocks();
    repository.existsBy.mockImplementation(
      async ({ email }: { email: string }) => storedUser?.email === email,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(GestorZona),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(Zona),
          useValue: repository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('registers with a password hash and logs in using the original password', async () => {
    const credentials: RegisterDto = {
      email: 'viajero@example.com',
      password: 'clave-segura-123',
      nombre: 'Viajero',
      idiomaPref: 'es',
    };

    const registration = await authService.register(credentials);

    expect(registration).toEqual({
      user: {
        id: 1,
        email: credentials.email,
        nombre: credentials.nombre,
        role: UserRole.Usuario,
      },
      token: 'signed-token',
    });
    const registeredUser = storedUser;
    expect(registeredUser).not.toBeNull();
    if (!registeredUser) {
      throw new Error('El registro no guardó el usuario');
    }
    expect(registeredUser.passwordHash).not.toBe(credentials.password);
    await expect(
      bcrypt.compare(credentials.password, registeredUser.passwordHash),
    ).resolves.toBe(true);

    const login = await authService.login({
      email: credentials.email,
      password: credentials.password,
    });

    expect(login).toEqual(registration);
    expect(repository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: credentials.email },
        select: expect.objectContaining({ passwordHash: true }),
      }),
    );
  });

  it('rejects role assignment in public registration and validates roles for user creation', async () => {
    for (const role of [UserRole.Admin, UserRole.Gestor]) {
      const registration = plainToInstance(RegisterDto, {
        email: 'viajero@example.com',
        password: 'clave-segura-123',
        nombre: 'Viajero',
        role,
      });
      const registrationErrors = await validate(registration, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      expect(registrationErrors.map((error) => error.property)).toContain(
        'role',
      );
    }

    const invalidUser = plainToInstance(CreateUserDto, {
      email: 'viajero@example.com',
      password: 'clave-segura-123',
      nombre: 'Viajero',
      role: 'superadmin',
    });
    const userErrors = await validate(invalidUser);
    expect(userErrors.map((error) => error.property)).toContain('role');
  });
});

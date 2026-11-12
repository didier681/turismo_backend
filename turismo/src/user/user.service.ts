import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGestorDto } from './dto/create-gestor.dto';
import { AssignGestorZonasDto } from './dto/assign-gestor-zonas.dto';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { Zona } from '../zona/entities/zona.entity';

@Injectable()
// Contiene las reglas de negocio y el acceso a persistencia de usuarios.
export class UserService {
  // Número de rondas usado para generar hashes de contraseñas con bcrypt.
  private readonly saltRounds = 10;

  // Recibe el repositorio de TypeORM para consultar y guardar usuarios.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GestorZona)
    private readonly gestorZonaRepository: Repository<GestorZona>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  /**
   * Crea una cuenta, comprueba el correo y guarda la contraseña como hash.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.role === UserRole.Gestor) {
      throw new BadRequestException(
        'Los gestores deben crearse mediante POST /users/gestores',
      );
    }
    await this.assertIdentityAvailable(
      createUserDto.email,
      createUserDto.documentoIdentidad,
    );

    // Nunca se persiste la contraseña recibida en texto plano.
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    // Asigna solo los datos permitidos y usa el rol predeterminado si falta.
    const user: User = this.userRepository.create({
      email: createUserDto.email,
      nombre: createUserDto.nombre,
      idiomaPref: createUserDto.idiomaPref,
      passwordHash: hashedPassword,
      role: createUserDto.role ?? UserRole.Usuario,
      documentoIdentidad: createUserDto.documentoIdentidad ?? null,
      soporteUrl: createUserDto.soporteUrl ?? null,
    });

    // Persiste la cuenta y devuelve la entidad creada.
    return await this.userRepository.save(user);
  }

  // Crea un gestor inactivo; el administrador debe activarlo explícitamente.
  async createGestor(createGestorDto: CreateGestorDto): Promise<User> {
    await this.assertIdentityAvailable(
      createGestorDto.email,
      createGestorDto.documentoIdentidad,
    );
    const user = this.userRepository.create({
      email: createGestorDto.email,
      nombre: createGestorDto.nombre,
      idiomaPref: createGestorDto.idiomaPref,
      passwordHash: await bcrypt.hash(
        createGestorDto.password,
        this.saltRounds,
      ),
      documentoIdentidad: createGestorDto.documentoIdentidad,
      soporteUrl: createGestorDto.soporteUrl ?? null,
      role: UserRole.Gestor,
      isActive: false,
    });
    return await this.userRepository.save(user);
  }

  // Añade zonas a un gestor y evita crear asignaciones duplicadas.
  async assignZonas(
    idUsuario: number,
    dto: AssignGestorZonasDto,
  ): Promise<GestorZona[]> {
    const user = await this.findOne(idUsuario);
    if (user.role !== UserRole.Gestor) {
      throw new BadRequestException(
        'Las zonas solo pueden asignarse a usuarios con rol gestor',
      );
    }

    const zonasExistentes = await this.zonaRepository.findBy(
      dto.idZonas.map((idZona) => ({ idZona })),
    );
    if (zonasExistentes.length !== dto.idZonas.length) {
      const existentes = new Set(zonasExistentes.map((zona) => zona.idZona));
      const idInexistente = dto.idZonas.find(
        (idZona) => !existentes.has(idZona),
      );
      throw new NotFoundException(`Zona con ID ${idInexistente} no encontrada`);
    }

    return await this.gestorZonaRepository.save(
      dto.idZonas.map((idZona) =>
        this.gestorZonaRepository.create({ idUsuario, idZona }),
      ),
    );
  }

  // Activa la cuenta de un gestor tras la aprobación administrativa.
  async activate(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (user.role !== UserRole.Gestor) {
      throw new BadRequestException(
        'Solo pueden activarse cuentas con rol gestor mediante esta ruta',
      );
    }
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  /**
   * Lista usuarios sin cargar hashes de contraseña.
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Busca un usuario por ID o lanza 404 si no existe.
   */
  async findOne(id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Busca por ID sin excepción; la estrategia JWT usa null para token inválido.
   */
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  /**
   * Busca por email y carga explícitamente el hash requerido por el login.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        documentoIdentidad: true,
        soporteUrl: true,
        nombre: true,
        idiomaPref: true,
        fechaRegistro: true,
        role: true,
        isActive: true,
      },
    });
  }

  /**
   * Actualiza los campos permitidos y vuelve a hashear si cambia la contraseña.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.findOne(id);
    if (
      updateUserDto.role === UserRole.Gestor &&
      user.role !== UserRole.Gestor
    ) {
      throw new BadRequestException(
        'Los gestores deben crearse mediante POST /users/gestores',
      );
    }
    const documentoIdentidad =
      updateUserDto.documentoIdentidad === undefined
        ? user.documentoIdentidad
        : updateUserDto.documentoIdentidad;
    if (user.role === UserRole.Gestor && !documentoIdentidad) {
      throw new BadRequestException(
        'El documento de identidad es obligatorio para los gestores',
      );
    }

    // Evita asignar un correo que ya pertenezca a otra cuenta.
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailTaken: boolean = await this.userRepository.existsBy({
        email: updateUserDto.email,
      });
      if (emailTaken) {
        throw new ConflictException('El email ya está registrado');
      }
    }
    if (
      updateUserDto.documentoIdentidad &&
      updateUserDto.documentoIdentidad !== user.documentoIdentidad &&
      (await this.userRepository.existsBy({
        documentoIdentidad: updateUserDto.documentoIdentidad,
      }))
    ) {
      throw new ConflictException(
        'El documento de identidad ya está registrado',
      );
    }

    // Separa la contraseña para no copiarla en texto plano a la entidad.
    const { password, ...changes } = updateUserDto;

    // Calcula el nuevo hash únicamente cuando se envía una contraseña.
    const passwordHash = password
      ? await bcrypt.hash(password, this.saltRounds)
      : undefined;

    // Aplica los campos validados y asigna el hash por separado.
    this.userRepository.merge(user, changes);
    if (passwordHash) {
      user.passwordHash = passwordHash;
    }

    return await this.userRepository.save(user);
  }

  private async assertIdentityAvailable(
    email: string,
    documentoIdentidad?: string,
  ): Promise<void> {
    if (await this.userRepository.existsBy({ email })) {
      throw new ConflictException('El email ya está registrado');
    }
    if (
      documentoIdentidad &&
      (await this.userRepository.existsBy({ documentoIdentidad }))
    ) {
      throw new ConflictException('El documento de identidad ya está registrado');
    }
  }

  /**
   * Elimina físicamente la cuenta después de comprobar que existe.
   */
  async remove(id: number): Promise<void> {
    const user: User = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

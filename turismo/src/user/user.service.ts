import {
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

@Injectable()
// Contiene las reglas de negocio y el acceso a persistencia de usuarios.
export class UserService {
  // Número de rondas usado para generar hashes de contraseñas con bcrypt.
  private readonly saltRounds = 10;

  // Recibe el repositorio de TypeORM para consultar y guardar usuarios.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea una cuenta, comprueba el correo y guarda la contraseña como hash.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Impide crear dos cuentas con el mismo correo.
    const emailTaken: boolean = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (emailTaken) {
      throw new ConflictException('El email ya está registrado');
    }

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
    });

    // Persiste la cuenta y devuelve la entidad creada.
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

    // Evita asignar un correo que ya pertenezca a otra cuenta.
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailTaken: boolean = await this.userRepository.existsBy({
        email: updateUserDto.email,
      });
      if (emailTaken) {
        throw new ConflictException('El email ya está registrado');
      }
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

  /**
   * Elimina físicamente la cuenta después de comprobar que existe.
   */
  async remove(id: number): Promise<void> {
    const user: User = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

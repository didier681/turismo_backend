import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
// Coordina el registro, el inicio de sesión y la validación de tokens.
export class AuthService {
  // Recibe los servicios de usuarios y firma JWT.
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Registra la cuenta y devuelve sus datos públicos con un token.
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // UserService aplica las reglas de creación y almacena la contraseña cifrada.
    const user: User = await this.userService.create(registerDto);

    return await this.buildAuthResponse(user);
  }

  // Comprueba credenciales y emite un token para cuentas activas.
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // La consulta incluye el hash necesario para verificar la contraseña.
    const user: User | null = await this.userService.findOneByEmail(email);

    // Usa un error genérico para no revelar si el email está registrado.
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Compara la contraseña enviada con el hash guardado.
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comprueba el estado después de validar credenciales para no revelar cuentas ajenas.
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return await this.buildAuthResponse(user);
  }

  // Verifica un JWT y recupera su usuario activo para usos fuera de Passport.
  async validateToken(token: string): Promise<User> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const user: User | null = await this.userService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }

  // Firma un token con la identidad y el rol del usuario.
  private async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Usa la configuración registrada en JwtModule para firmar el payload.
    return await this.jwtService.signAsync(payload);
  }

  // Construye la respuesta de registro o login sin incluir el hash.
  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const token: string = await this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
      token,
    };
  }
}

import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Permite que AuthService utilice el servicio de usuarios.
    UserModule,

    // Define JWT como estrategia predeterminada de Passport.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configura la firma y validación de JWT con valores de entorno.
    JwtModule.registerAsync({
      inject: [ConfigService],
      // Lee la duración como timespan y usa una hora si no se configura.
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn = configService.get<string>('JWT_EXPIRATION') ?? '1h';

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  // Expone las rutas de registro, login y perfil.
  controllers: [AuthController],
  // Registra el servicio y la estrategia Passport de autenticación.
  providers: [AuthService, JwtStrategy],
  // Permite reutilizar AuthService desde otros módulos.
  exports: [AuthService],
})
// Agrupa la configuración JWT y los componentes de autenticación.
export class AuthModule {}

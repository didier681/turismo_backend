import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UserRole } from './user/entities/user.entity';
import { UserService } from './user/user.service';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const configService = app.get(ConfigService);
    const email = configService.getOrThrow<string>('ADMIN_EMAIL');
    const password = configService.getOrThrow<string>('ADMIN_PASSWORD');
    const nombre = configService.getOrThrow<string>('ADMIN_NOMBRE');
    const userService = app.get(UserService);

    if (await userService.findOneByEmail(email)) {
      console.log(`El usuario administrador ${email} ya existe; no se realizaron cambios.`);
      return;
    }

    await userService.create({
      email,
      password,
      nombre,
      role: UserRole.Admin,
    });
    console.log(`Usuario administrador ${email} creado correctamente.`);
  } finally {
    await app.close();
  }
}

void seed().catch((error: unknown) => {
  console.error('No fue posible crear el usuario administrador:', error);
  process.exitCode = 1;
});

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

interface ExampleResponse {
  message: string;
  user: User;
}

@Controller('example')
@ApiTags('Example')
export class ExampleController {
  // Ruta protegida solo con autenticación
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('protected')
  protectedRoute(@GetUser() user: User): ExampleResponse {
    return {
      message: 'Esta ruta está protegida',
      user,
    };
  }

  // Ruta protegida solo para administradores
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Get('admin')
  adminRoute(@GetUser() user: User): ExampleResponse {
    return {
      message: 'Esta ruta es solo para administradores',
      user,
    };
  }
}
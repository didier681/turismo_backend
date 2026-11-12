import { Exclude, Expose } from 'class-transformer';

// Limita la respuesta de autenticación a campos explícitamente permitidos.
@Exclude()
export class AuthUser {
  @Expose()
  id: number;

  // El correo se incluye solo en respuestas de autenticación del propio usuario.
  @Expose({ groups: ['propio'] })
  email: string;

  @Expose()
  nombre: string;

  @Expose()
  role: string;

  // Los identificadores y soportes personales solo se entregan a su titular.
  @Expose({ groups: ['propio'] })
  documentoIdentidad: string | null;

  @Expose({ groups: ['propio'] })
  soporteUrl: string | null;
}

// Respuesta de los endpoints /auth/register y /auth/login
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

# Córdoba Cerca

Córdoba Cerca es una API de turismo para el departamento de Córdoba. Permite consultar y administrar sitios turísticos, negocios y servicios, y ofrece funciones para que las personas visitantes interactúen con el catálogo.

## Tecnologías

- NestJS y TypeScript
- TypeORM
- MySQL o MariaDB
- JWT para autenticación
- Swagger para la documentación interactiva

## Requisitos

- Node.js y npm
- MySQL o MariaDB en ejecución
- Una base de datos llamada `turismo`

## Instalación y ejecución

1. Clona el repositorio y entra al directorio del proyecto:

   ```bash
   git clone https://github.com/didier681/turismo_backend.git
   cd turismo_backend/turismo
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia `.env.example` como `.env` y configura las credenciales de la base de datos, el secreto JWT y los datos del administrador inicial.

   ```bash
   cp .env.example .env
   ```

   En Windows puedes usar `Copy-Item .env.example .env` desde PowerShell.

4. Crea la base de datos en MySQL o MariaDB:

   ```sql
   CREATE DATABASE turismo;
   ```

5. Crea el usuario administrador inicial. El comando no duplica el usuario si el correo ya existe:

   ```bash
   npm run seed
   ```

6. Inicia el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

La API estará disponible en `http://localhost:3000` (o en el puerto definido por `PORT`).

## Documentación y autenticación

Con el servidor en ejecución, abre Swagger en [http://localhost:3000/api/docs](http://localhost:3000/api/docs). Para probar rutas protegidas:

1. Regístrate o inicia sesión en los endpoints de autenticación.
2. Copia el valor `token` de la respuesta.
3. Pulsa **Authorize** en Swagger y pega solo el token, sin escribir el prefijo `Bearer`; Swagger lo añade automáticamente.
4. Pulsa **Authorize** y cierra el diálogo. Swagger enviará el token en las solicitudes protegidas.

## Roles

| Rol | Permisos principales |
| --- | --- |
| `admin` | Administra usuarios, zonas y categorías; gestiona sitios turísticos y los recursos de negocios. |
| `gestor` | Gestiona sitios turísticos y sus categorías dentro de las zonas asignadas. |
| `negocio` | Administra su negocio, categorías, servicios, tarifas, multimedia y publicidad. |
| `usuario` | Consulta el catálogo y registra favoritos, visitas y reseñas. |

Las rutas de escritura requieren autenticación y aplican permisos por rol y, cuando corresponde, validaciones de propiedad o asignación.

## Endpoints personales y administrativos

- `GET /visitas/mias`: lista las visitas del usuario autenticado. `GET /visitas` y `GET /visitas/:id` son exclusivos de administradores.
- `GET /favoritos/mios`: lista los favoritos del usuario autenticado. `GET /favoritos` y `GET /favoritos/:idUsuario/:idSitio` son exclusivos de administradores.
- `PATCH /negocios/:id/membresia`: permite a un administrador cambiar la membresía (`gratis`, `basico` o `premium`). Los negocios nuevos siempre comienzan con membresía gratis.

## Módulos

- **Autenticación y usuarios:** `auth` y `user` para registro, inicio de sesión, perfiles y administración de cuentas.
- **Zonas y sitios turísticos:** `zona`, `sitio-turistico`, `categoria-sitio` y `sitio-categoria`.
- **Interacciones:** `favorito`, `resena` y `visita`.
- **Negocios:** `categoria-negocio`, `negocio`, `negocio-categoria`, `servicio`, `tarifa`, `publicidad` y `multimedia`.

## Reglas de negocio principales

- El registro público siempre crea usuarios con rol `usuario`; no permite asignar un rol privilegiado.
- Las contraseñas se almacenan cifradas con bcrypt. El inicio de sesión requiere credenciales válidas y una cuenta activa.
- El correo y el documento de identidad deben ser únicos. Los gestores se crean inactivos y requieren aprobación; sus zonas se asignan explícitamente.
- Una persona usuaria solo puede publicar una reseña por sitio.
- Las coordenadas de los negocios deben estar dentro de los rangos geográficos válidos.
- No se permiten tarifas del mismo nombre con períodos de vigencia superpuestos para un servicio.
- La publicidad no se habilita para negocios con membresía gratuita.
- Cada entidad admite como máximo diez registros multimedia.

## Pruebas y calidad

```bash
npm test          # Pruebas unitarias
npm run test:e2e  # Pruebas de extremo a extremo
npm run lint      # Análisis estático
npm run build     # Compilación
```

import { SetMetadata } from '@nestjs/common';

/*====================// Decorador de Roles // ====================*/

/* nomas sirve para definir un decorador personalizado llamado Roles, que se utiliza para asignar
 roles a los endpoints en los controladores. Este decorador utiliza la función SetMetadata de NestJS
  para asociar los roles especificados con la clave 'roles', lo que luego puede ser utilizado por el
   guardia de roles (RolesGuard) para verificar si el usuario tiene el rol necesario para acceder a ese
    endpoint. Por ejemplo, en el AuthController, se utiliza @Roles(Rol.ADMIN) para indicar que solo los 
    usuarios con el rol ADMIN pueden acceder al endpoint de registro. */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

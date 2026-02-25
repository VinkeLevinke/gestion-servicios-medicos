import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
/*====================// Guardia de Roles // ====================*/

/* Esta clase RolesGuard implementa la interfaz CanActivate de NestJS, lo que la convierte en un guardia de autorización
 que se puede utilizar para proteger rutas específicas en los controladores. */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Esto obtiene los roles requeridos para el endpoint específico que se está accediendo, utilizando el decorador @Roles que se define en el controlador.
        context.getClass(), // Esto obtiene los roles requeridos para toda la clase del controlador, en caso de que se hayan definido roles a nivel de clase en lugar de a nivel de método.
      ],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }
    return true;
  }
}

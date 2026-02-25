import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/*====================// Guardia de Autenticación JWT // ====================*/

/* Esta clase JwtAuthGuard extiende la clase AuthGuard de Passport.js, utilizando la estrategia 'jwt' que se define en la clase JwtStrategy.
 Al extender AuthGuard('jwt'), esta clase se convierte en un guardia de autenticación que puede ser utilizado para proteger rutas en los controladores, 
 asegurando que solo los usuarios autenticados con un token JWT válido puedan acceder a esas rutas. Por ejemplo, en el controlador de servicios médicos, 
 se podría usar @UseGuards(JwtAuthGuard) para proteger ciertas rutas y requerir que el usuario esté autenticado antes de permitir el acceso. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }


/* el guard de autenticación JWT es una parte fundamental de la seguridad en la aplicación, ya que se encarga de verificar que las solicitudes a las rutas protegidas incluyan un token JWT válido. */
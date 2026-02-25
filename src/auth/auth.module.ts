import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
/*====================// Módulo de Autenticación // ====================*/

/* Este módulo se encarga de toda la lógica relacionada con la autenticación, incluyendo el registro de usuarios, el inicio de sesión y la generación de tokens JWT. */

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Esto importa el ConfigModule para que pueda ser utilizado dentro de la función de fábrica para configurar el módulo JWT.
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // La clave secreta para firmar los tokens JWT se obtiene de las variables de entorno a través del ConfigService, lo que mejora la seguridad al no hardcodear esta información en el código fuente.
        signOptions: { expiresIn: '24h' }, // Esto establece que los tokens JWT generados por este módulo tendrán una validez de 24 horas, lo que significa que después de ese tiempo, el usuario deberá iniciar sesión nuevamente para obtener un nuevo token. Esto es una buena práctica de seguridad para limitar la duración de los tokens y reducir el riesgo de uso indebido en caso de que un token sea comprometido.
      }),
      inject: [ConfigService], // Esto indica que el ConfigService debe ser inyectado en la función de fábrica para que pueda acceder a las variables de entorno y configurar el módulo JWT correctamente.
    }),
  ],
  controllers: [AuthController], // Esto registra el AuthController en este módulo, lo que permite que las rutas definidas en ese controlador estén disponibles para manejar las solicitudes relacionadas con la autenticación.
  providers: [AuthService, JwtStrategy], // Esto registra el AuthService y JwtStrategy como proveedores en este módulo, lo que permite que sean inyectados y utilizados en otras partes de la aplicación, como en el AuthController para manejar la lógica de autenticación y en los guards para proteger las rutas.
  exports: [AuthService], // Esto exporta el AuthService para que pueda ser utilizado en otros módulos de la aplicación, como el módulo de servicios médicos, donde se podría necesitar verificar la autenticación o el rol del usuario para ciertas operaciones.
})
export class AuthModule {}
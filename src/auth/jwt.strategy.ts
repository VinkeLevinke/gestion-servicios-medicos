import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
/*====================// Estrategia JWT // ====================*/

/* Esta clase JwtStrategy extiende la clase PassportStrategy de Passport.js, utilizando la estrategia JWT. Se configura para extraer el token JWT de las cabeceras de autorización (Bearer Token)
 y para verificar la firma del token utilizando una clave secreta obtenida de las variables de entorno a través del ConfigService. El método validate se encarga de validar el payload del token y 
 devolver la información relevante del usuario (id, email y rol) que se incluirá en el objeto request.user para su uso en los guards y controladores protegidos. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, rol: payload.rol };
  }
}
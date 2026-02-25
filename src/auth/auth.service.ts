import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/*====================// Servicio de Autenticación // ====================*/

/* Este servicio se encarga de toda la lógica relacionada con la autenticación, incluyendo el registro de usuarios, el inicio de sesión y la generación de tokens JWT. */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Función privada para normalizar Nombres (Primera mayúscula, resto minúscula) //
  private formatName(name: string): string {
    if (!name) return '';
    const clean = name.trim().toLowerCase();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Función para registrar un nuevo usuario, que recibe un DTO con los datos de registro, hashea la contraseña y crea el usuario en la base de datos. Luego, genera un token JWT para el nuevo usuario.
  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        email: dto.email, // Ya viene en minúsculas por el DTO //
        nombre: this.formatName(dto.nombre),
        apellido: this.formatName(dto.apellido),
        password: hashed,
        rol: dto.rol || 'CLIENT',
      },
    });

    return this.generateToken(user); // Genera un token JWT para el nuevo usuario registrado
  }

  async login(dto: LoginDto) {
    // Tambien normalizamos el email en el login para evitar problemas de mayúsculas o espacios
    const cleanEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.usuario.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.generateToken(user);
  }

  /* Esta función privada generateToken toma un objeto de usuario como argumento, crea un payload con la información relevante del usuario (id, email y rol)
   y luego utiliza el servicio JwtService para firmar este payload y generar un token JWT. El token se devuelve en un objeto con la propiedad access_token,
    que es el formato comúnmente utilizado para enviar tokens JWT al cliente después de un inicio de sesión exitoso o registro. Este token puede ser utilizado
     por el cliente para autenticar futuras solicitudes a la API, proporcionando acceso a recursos protegidos según el rol del usuario. */
  private generateToken(user: any) {
    //
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }
}

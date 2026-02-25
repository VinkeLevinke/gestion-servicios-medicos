import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards 
} from '@nestjs/common';
/* ====================// Controlador de Autenticación // ====================*/
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 
import { RolesGuard } from './guards/roles.guard'; 
import { Roles } from './roles.decorator';
import { Rol } from '@prisma/client';

/* Este controlador maneja las rutas relacionadas con la autenticación, como el registro y el inicio de sesión.*/

@ApiTags('Auth') // Esto agrupa los endpoints de autenticación bajo la etiqueta "Auth" en la documentación de Swagger
@Controller('auth') // Esto define que todas las rutas en este controlador comenzarán con /auth (por ejemplo, /auth/register y /auth/login)

export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBearerAuth() // Esto pone el candadito en Swagger para este endpoint
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN) // Solo los usuarios con rol ADMIN pueden acceder a este endpoint
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente por el ADMIN' })
  @ApiResponse({ status: 401, description: 'No autorizado (Falta Token)' })
  @ApiResponse({ status: 403, description: 'Prohibido (Solo ADMIN)' })
   @ApiResponse({ status: 400, description: 'El rol no es valido, debe ser CLIENT o ADMIN' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login') // Esto define que esta ruta será /auth/login
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) { // El decorador @Body() indica que los datos de la solicitud se deben extraer del cuerpo de la petición y se espera que coincidan con la estructura definida en LoginDto. Luego, estos datos se pasan al método login del servicio de autenticación para procesar el inicio de sesión.
    return this.authService.login(dto);
  }
}
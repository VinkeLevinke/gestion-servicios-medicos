import {
  IsEmail,
  IsString,
} from 'class-validator'; /* usamos decoradores de class-validator para validar los datos de entrada facilmente y sin mucho problema*/
import { ApiProperty } from '@nestjs/swagger';
/*====================// DTO para Login // ====================*/

/* Simplemente es un DTO (Data Transfer Object) que define la estructura de los datos que se esperan recibir
 cuando un usuario intenta iniciar sesión. */

export class LoginDto {
  /* datos que se mostrarán en la documentación de Swagger, como el ejemplo y la descripción. Además,
   se utilizan decoradores de validación para asegurarse de que el correo electrónico sea válido y que la
    contraseña sea una cadena de texto. Esto ayuda a garantizar que los datos que llegan a tu aplicación sean
     correctos y seguros. */
  @ApiProperty({ example: 'admin@medico.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  password: string;
}

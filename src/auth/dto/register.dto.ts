import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'correo@randommegias.com' })
  @Transform(({ value }) => value?.toLowerCase().trim()) // Se normalizo el Email para evitar problemas de mayúsculas y espacios
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'Carlanga' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Suarez' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ enum: Rol, default: 'CLIENT', required: false })
  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}
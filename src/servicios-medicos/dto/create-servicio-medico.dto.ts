import { 
  IsString, 
  IsNumber, 
  IsDateString, 
  IsInt, 
  IsPositive, 
  MinLength, 
  IsNotEmpty, 
  IsOptional 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
/*====================// DTO para Crear Servicio Médico // ====================*/

/* Este DTO (Data Transfer Object) define la estructura de los datos necesarios para crear un nuevo servicio médico en la aplicación. 
Incluye validaciones utilizando decoradores de class-validator para asegurar que los datos recibidos sean correctos y cumplan con los requisitos establecidos,
como el tipo de dato, la longitud mínima, y la obligatoriedad de ciertos campos. Además, se utilizan decoradores de ApiProperty para documentar cada propiedad 
en Swagger, proporcionando ejemplos y descripciones claras para los consumidores de la API. */

export class CreateServicioMedicoDto {
  @ApiProperty({ example: 'Limpieza Dental', description: 'Nombre del servicio médico' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({ required: false, example: 'Tratamiento preventivo básico' })
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional() 
  descripcion?: string;

  @ApiProperty({ example: 45.50 })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @IsPositive({ message: 'El costo debe ser mayor a 0' })
  costo: number;

  @ApiProperty({ example: 30, description: 'Duración estimada en minutos' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @IsPositive({ message: 'La duración debe ser positiva' })
  duracionMinutos: number;

  @ApiProperty({ 
    type: String, 
    format: 'date-time', 
    example: '2026-03-01T10:00:00Z',
    description: 'Fecha en formato ISO 8601' 
  })
  @IsDateString({}, { message: 'La fecha de disponibilidad debe tener un formato ISO válido' })
  fechaDisponibilidad: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría existente' })
  @IsInt({ message: 'El ID de categoría debe ser un número entero' })
  categoriaId: number;
}
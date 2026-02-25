import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindServiciosDto {
  @ApiPropertyOptional({ 
    description: 'Buscar por nombre del servicio (parcial e insensible a mayúsculas)',
    example: 'Consulta' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ 
    type: String, 
    format: 'date', // Esto habilita el selector de fecha en Swagger
    description: 'Filtrar servicios desde esta fecha (YYYY-MM-DD)',
    example: '2026-02-01' 
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fechaDesde debe ser un formato válido (YYYY-MM-DD)' })
  fechaDesde?: string;

  @ApiPropertyOptional({ 
    type: String, 
    format: 'date', // Esto habilita el selector de fecha en Swagger
    description: 'Filtrar servicios hasta esta fecha (YYYY-MM-DD)',
    example: '2026-12-31' 
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fechaHasta debe ser un formato válido (YYYY-MM-DD)' })
  fechaHasta?: string;
}
import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  Query, UseGuards, HttpCode, HttpStatus 
} from '@nestjs/common';
import { ServiciosMedicosService } from './servicios-medicos.service';
import { CreateServicioMedicoDto } from './dto/create-servicio-medico.dto';
import { UpdateServicioMedicoDto } from './dto/update-servicio-medico.dto';
import { FindServiciosDto } from './dto/find-servicios.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
/* ====================// Controlador de Servicios Médicos // ====================*/

@ApiTags('Servicios Médicos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('servicios-medicos')
@ApiResponse({ status: 401, description: 'No autorizado - Token inexistente o inválido.' })
export class ServiciosMedicosController {
  constructor(private readonly service: ServiciosMedicosService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Registrar nuevo servicio médico (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Servicio creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error de validación en los datos de entrada.' })
  @ApiResponse({ status: 403, description: 'Acceso restringido - Solo perfil ADMINISTRADOR.' })
  create(@Body() dto: CreateServicioMedicoDto) {
    return this.service.create(dto);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Panel General de Auditoría (Solo ADMIN)', 
    description: 'Visualización de todos los registros del sistema, incluyendo servicios inactivos.' 
  })
  @ApiResponse({ status: 200, description: 'Historial completo recuperado.' })
  @ApiResponse({ status: 404, description: 'El sistema no cuenta con registros históricos.' })
  findAllForAdmin() {
    return this.service.findAllAdmin();
  }

  @Get()
  @Roles('CLIENT', 'ADMIN')
  @ApiOperation({ 
    summary: 'Catálogo de Servicios Disponibles', 
    description: 'Consulta de servicios activos con soporte para búsqueda avanzada y filtros.' 
  })
  @ApiResponse({ status: 200, description: 'Listado de servicios disponibles obtenido.' })
  @ApiResponse({ status: 404, description: 'No se encontraron servicios que coincidan con la búsqueda.' })
  findAll(@Query() filters: FindServiciosDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @Roles('CLIENT', 'ADMIN')
  @ApiOperation({ summary: 'Consultar detalle de un servicio específico' })
  @ApiResponse({ status: 200, description: 'Información detallada del servicio.' })
  @ApiResponse({ status: 404, description: 'El servicio solicitado no está disponible o no existe.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar información de un servicio (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Servicio actualizado correctamente.' })
  @ApiResponse({ status: 403, description: 'Acceso restringido - Requiere permisos de nivel ADMINISTRADOR.' })
  @ApiResponse({ status: 404, description: 'No se pudo localizar el servicio para su edición.' })
  update(@Param('id') id: string, @Body() dto: UpdateServicioMedicoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar servicio - Borrado Lógico (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Servicio desactivado exitosamente del catálogo.' })
  @ApiResponse({ status: 403, description: 'Acceso restringido - Acción exclusiva de ADMINISTRADOR.' })
  @ApiResponse({ status: 404, description: 'Referencia de servicio no encontrada para desactivación.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicioMedicoDto } from './dto/create-servicio-medico.dto';
import { UpdateServicioMedicoDto } from './dto/update-servicio-medico.dto';
import { FindServiciosDto } from './dto/find-servicios.dto';
/* ====================// Servicio de Servicios Médicos // ====================*/

@Injectable()
export class ServiciosMedicosService {
  constructor(private prisma: PrismaService) {} //constuctor para inyectar el servicio de Prisma, que se utiliza para interactuar con la base de datos a través de Prisma ORM. Esto permite realizar operaciones como crear, leer, actualizar y eliminar registros relacionados con los servicios médicos en la base de datos.

 /* ====================// Función para Crear un Nuevo Servicio Médico con Validación de Duplicados // ====================*/
  async create(dto: CreateServicioMedicoDto) {
   
    const exists = await this.prisma.servicioMedico.findFirst({
      where: { nombre: { equals: dto.nombre, mode: 'insensitive' }, isActive: true }
    });

    if (exists) {
      throw new ConflictException(`Ya existe un servicio activo con el nombre: ${dto.nombre}`);
    }

    return this.prisma.servicioMedico.create({
      data: { ...dto, fechaDisponibilidad: new Date(dto.fechaDisponibilidad) },
      include: { categoria: true },
    });
  }

  /* ====================// Función para Buscar Servicios Médicos con Filtros Avanzados // ====================*/
  async findAll(filters: FindServiciosDto) {
    const where: any = { isActive: true };

    if (filters.nombre) {
      where.nombre = { contains: filters.nombre, mode: 'insensitive' }; // Búsqueda por nombre con insensibilidad a mayúsculas
    }

    if (filters.fechaDesde || filters.fechaHasta) {
      where.fechaDisponibilidad = {};
      if (filters.fechaDesde) where.fechaDisponibilidad.gte = new Date(filters.fechaDesde);
      if (filters.fechaHasta) where.fechaDisponibilidad.lte = new Date(filters.fechaHasta);
    }

    const servicios = await this.prisma.servicioMedico.findMany({
      where,
      include: { categoria: true },
      orderBy: { fechaDisponibilidad: 'asc' },
    });

    if (servicios.length === 0) {
      throw new NotFoundException('No se encontraron servicios médicos activos con los criterios proporcionados.');
    }

    return servicios;
  }
/* ====================// Función para Buscar Todos los Servicios Médicos (Incluyendo Inactivos) para el Panel de Auditoría // ====================*/
  async findAllAdmin() {
    const servicios = await this.prisma.servicioMedico.findMany({
      include: { categoria: true },
      orderBy: { createdAt: 'desc' }, 
    });

    if (servicios.length === 0) {
      throw new NotFoundException('Actualmente no existen registros de servicios médicos en el sistema.');
    }

    return servicios;
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicioMedico.findUnique({
      where: { id, isActive: true },
      include: { categoria: true },
    });
    
    if (!servicio) {
      throw new NotFoundException(`El servicio médico con ID ${id} no existe o ha sido desactivado.`);
    }
    
    return servicio;
  }

  /* ====================// Función para Actualizar un Servicio Médico // ====================*/
  async update(id: number, dto: UpdateServicioMedicoDto) {
    // Verificamos que exista antes de intentar actualizar
    await this.findOne(id);
    
    return this.prisma.servicioMedico.update({
      where: { id },
      data: dto.fechaDisponibilidad 
        ? { ...dto, fechaDisponibilidad: new Date(dto.fechaDisponibilidad) } 
        : dto,
      include: { categoria: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.servicioMedico.update({
      where: { id },
      data: { 
        isActive: false, 
        deletedAt: new Date() 
      },
    });
  }
}
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
/*====================// Módulo de Prisma // ====================*/

/* Este módulo es responsable de proporcionar el servicio PrismaService a toda la aplicación. 
Al marcarlo como @Global(), se asegura que el PrismaService esté disponible en cualquier parte de la aplicación
 sin necesidad de importarlo explícitamente en cada módulo. Esto facilita el acceso a la base de datos a través
  de Prisma desde cualquier servicio o controlador que lo necesite, promoviendo una arquitectura más limpia y modular. */
  
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }

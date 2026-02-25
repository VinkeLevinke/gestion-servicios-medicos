import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
/*====================// Servicio de Prisma // ====================*/

/* Este servicio PrismaService extiende la clase PrismaClient proporcionada por el paquete
 @prisma/client, lo que le permite interactuar con la base de datos utilizando Prisma. */

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
import { Module } from '@nestjs/common';
import { ServiciosMedicosService } from './servicios-medicos.service';
import { ServiciosMedicosController } from './servicios-medicos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ServiciosMedicosController],
  providers: [ServiciosMedicosService],
})
export class ServiciosMedicosModule {}
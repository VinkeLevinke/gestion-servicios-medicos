import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
/*====================// Importacions // ====================*/

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  /* Son las pautas de entregada de datos, es mas que todo para validar que los datos que 
   entran a la aplicación sean correctos y seguros, evitando así errores comunes como datos
   faltantes, tipos incorrectos o incluso ataques de inyección. Es como un guardián de la puerta
   de tu aplicación, asegurándose de que solo los datos válidos puedan entrar. En este caso, se está 
   utilizando el ValidationPipe globalmente, lo que significa que todas las rutas de tu aplicación se 
   beneficiarán de esta validación automática.*/
 
    app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  //Filtro global para manejar excepciones de Prisma y convertirlas en respuestas HTTP adecuadas
  //es como un middleware que intercepta los errores de Prisma y los convierte en respuestas HTTP amigables para el cliente.
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Ajustes y configuración de Swagger para la documentación
  const config = new DocumentBuilder()
    .setTitle('Gestión de Servicios Médicos API')
    .setDescription(
      'API REST robusta con NestJS + Prisma + PostgreSQL. ' +
      'Incluye RBAC (ADMIN/CLIENT), Borrado Lógico y Búsqueda Avanzada.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  
  logger.log(`El Servidor esta corriendo en http://localhost:${port}`);
  logger.log(`Para la Documentación Interactiva: http://localhost:${port}/docs`);
} 
bootstrap();
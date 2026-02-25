import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
/* ====================// Filtro de Excepciones para Prisma // ====================*/
/* Este filtro de excepciones personalizado, PrismaExceptionFilter, está diseñado para manejar errores específicos que pueden ocurrir al interactuar con la base de datos a través de Prisma.
 En particular, captura las excepciones del tipo PrismaClientKnownRequestError, que son errores conocidos que Prisma puede lanzar, como violaciones de restricciones únicas (por ejemplo, intentar
  crear un usuario con un email que ya existe). El filtro analiza el código de error y devuelve una respuesta HTTP adecuada al cliente, proporcionando información clara sobre el error ocurrido. 
  Esto mejora la experiencia del usuario al recibir mensajes de error más amigables y específicos en lugar de errores genéricos del servidor. */

  @Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.code;

    switch (code) {
      case 'P2002': { // Error de Restricción Única (Duplicados)
        const status = HttpStatus.CONFLICT; // 409 Conflict
        const target = (exception.meta?.target as string[]) || ['campo']; // Esto extrae el campo que causó el error de duplicado, si está disponible en los metadatos de la excepción. Si no se proporciona, se usará 'campo' como valor predeterminado.
        
        response.status(status).json({
          statusCode: status,
          message: `Conflicto de datos: Ya existe un registro con ese ${target.join(', ')}.`,
          error: 'Conflict',
        });
        break;
      }
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ // Para cualquier otro error de Prisma que no sea el P2002, se devuelve un error genérico de servidor interno.
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,// Esto establece el código de estado HTTP a 500 Internal Server Error, indicando que ocurrió un error inesperado en el servidor.
          message: 'Error interno en el servidor de base de datos.',
        });
        break;
    }
  }
}
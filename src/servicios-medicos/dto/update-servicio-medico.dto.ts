import { PartialType } from '@nestjs/swagger';
import { CreateServicioMedicoDto } from './create-servicio-medico.dto';
//====================// DTO para Actualizar Servicio Médico // ====================//

export class UpdateServicioMedicoDto extends PartialType(
  CreateServicioMedicoDto,
) {}

/*
Este DTO (Data Transfer Object) para actualizar un servicio médico se basa en el DTO de creación 
(CreateServicioMedicoDto) utilizando la función PartialType de @nestjs/swagger. Esto significa que
 todas las propiedades definidas en CreateServicioMedicoDto son opcionales en UpdateServicioMedicoDto,
 lo que permite a los clientes enviar solo los campos que desean actualizar sin necesidad de proporcionar 
todos los datos del servicio médico. Esta es una práctica común para los DTOs de actualización, ya que
 facilita la flexibilidad y la simplicidad al realizar actualizaciones parciales en los recursos existentes. */

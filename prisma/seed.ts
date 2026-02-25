import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
/*====================// Script de Seed para la Base de Datos // ====================*/

const prisma = new PrismaClient();

  /* Cree una función asincrónica llamada main que se encargará de ejecutar el proceso de seed.
   Dentro de esta función, se utiliza bcrypt para hashear la contraseña del usuario admin antes
   de almacenarla en la base de datos. Luego, se utiliza el método upsert de Prisma para crear un
   usuario admin con un correo electrónico específico, nombre, apellido, contraseña hasheada y rol
   ADMIN. Si el usuario ya existe (basado en el correo electrónico), no se realizará ninguna actualización
   (update: {}), pero si no existe, se creará con los datos proporcionados (create: {...}).*/

async function main() {
  // hash en bycript con un rango de seguridad de 10 digitos //
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({

    where: { email: 'admin@medico.com' },

    update: {},

    create: {

      email: 'admin@medico.com',

      nombre: 'Admin',

      apellido: 'Principal',

      password: hashedPassword,

      rol: 'ADMIN',

    },
  });

  // Categorías iniciales para los servicios médicos, utilizando upsert para evitar duplicados si el seed se ejecuta varias veces.
  await prisma.categoria.upsert({

    where: { nombre: 'Consultas Generales' },

    update: {},

    create: { nombre: 'Consultas Generales' },

  });
  await prisma.categoria.upsert({

    where: { nombre: 'Especialidades' },

    update: {},

    create: { nombre: 'Especialidades' },

  });
  await prisma.categoria.upsert({

    where: { nombre: 'Procedimientos' },

    update: {},

    create: { nombre: 'Procedimientos' },

  });

  console.log('El Seed ha sido completado: ADMIN y categorías creados');
}

main()

  .catch((e) => console.error(e))
  
  .finally(async () => await prisma.$disconnect());
  

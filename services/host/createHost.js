import { PrismaClient } from "@prisma/client"

const createHost = async (create) => {
  console.log(`createHost${create}`)
  const prisma = new PrismaClient()
  
  try {
    const existingUser = await prisma.host.findFirst({
      where: {
        OR: [
          { username: create.username},
        ]
      }
  });
  if (existingUser) {
    throw new Error('A host with this username already exists.');
  } else {
    const host = await prisma.host.create({
      data: create,
    });
    return host;
  }
} catch (error) {
  if (error.name === 'PrismaClientValidationError') {
    throw new Error('Validation error: ' + error.message);
  } else if (error.code === 'P2002') {
    throw new Error('A host with this username already exists.');
  } else if (error.code === 'P2003') {
    throw new Error('Foreign key constraint failed.');
  } else if (error.code === 'P2025') {
    throw new Error('Host to update not found.');
  } else {
    console.error("Error creating host:", error);
    throw error;
  }
} finally {
    await prisma.$disconnect();
}
}

export default createHost
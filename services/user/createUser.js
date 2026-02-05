import { PrismaClient } from "@prisma/client"

const createUser = async (create) => {
    const prisma = new PrismaClient()
    
    try {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { username: create.username},
            ]
          }
        });
        if (existingUser) {
          throw new Error('A user with this username already exists.');
        }
        const user = await prisma.user.create({
          data: create,
        });
        return user;
        
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        throw new Error('Validation error: ' + error.message);
      } else if (error.code === 'P2002') {
        throw new Error('A user with this username already exists.');
      } else if (error.code === 'P2003') {
        throw new Error('Foreign key constraint failed.');
      } else if (error.code === 'P2025') {
        throw new Error('Record to update not found.');
      } else {
        console.error("Error creating user:", error);
          throw error;
        }
      } finally {
        await prisma.$disconnect();
    }
}

export default createUser
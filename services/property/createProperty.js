import { PrismaClient } from "@prisma/client"

const createProperty = async (create) => {
    const prisma = new PrismaClient()
    try {
        const property = await prisma.property.create({
          data: create,
        });
        return property;
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        throw new Error('Validation error: ' + error.message);
      } else if (error.code === 'P2002') {
        throw new Error('A property with this ID already exists.');
      } else if (error.code === 'P2003') {
        throw new Error('Foreign key constraint failed.');
      } else if (error.code === 'P2025') {
        throw new Error('Record to update not found.');
      } else {
        console.error("Error creating property:", error);
        throw error;
      }
    } finally {
        await prisma.$disconnect();
    }
}

export default createProperty
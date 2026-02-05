import { PrismaClient } from "@prisma/client"

const updatePropertyById = async (id, update) => {
    const prisma = new PrismaClient()
    
    try {
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: update,
      });
        
      return updatedProperty;
    } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('A property with this ID already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Record to update not found.');
        } else {
          throw new Error('An unexpected error occurred while updating the property.');
        }
      } finally {
        await prisma.$disconnect();
      }
}

export default updatePropertyById
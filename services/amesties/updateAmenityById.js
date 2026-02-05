import { PrismaClient } from "@prisma/client"

const updateAmenityById = async (id, update) => {
    const prisma = new PrismaClient()
    try {
        const amenity = await prisma.amenity.update({
          where: { id },
          data: update,
        });
        return amenity;
    } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('An amenity with this name already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Record to update not found.');
        } else {
          console.error("Error updating amenity:", error);
          throw error;
        }
    } finally {
        await prisma.$disconnect();
    }
}

export default updateAmenityById
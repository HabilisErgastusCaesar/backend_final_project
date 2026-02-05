import { PrismaClient } from "@prisma/client"

const deleteAmenityById = async (id) => {
    const prisma = new PrismaClient()
    try {
      const amenity = await prisma.amenity.delete({
        where: { id },
      });
      return amenity;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Record to delete not found.');
      } else {
        console.error("Error deleting amenity:", error);
        throw error;
      }
    } finally {
      await prisma.$disconnect();
    }
}

export default deleteAmenityById
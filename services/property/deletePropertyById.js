import { PrismaClient } from "@prisma/client"

const deletePropertyById = async (id) => {
  const prisma = new PrismaClient()
  
  try {
    const deletedProperty = await prisma.property.delete({
      where: { id },
    });

    return deletedProperty;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Record to delete not found.');
    } else if (error.code === 'P2003') {
      throw new Error('Cannot delete property as it is referenced by other records.');
    } else {
      throw new Error('An unexpected error occurred while deleting the property.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

export default deletePropertyById
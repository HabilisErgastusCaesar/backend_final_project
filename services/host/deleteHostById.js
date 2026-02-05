import { PrismaClient } from "@prisma/client"

const deleteHostById = async (id) => {
  console.log(`deleteHost ${id}`)
  const prisma = new PrismaClient()
  
  try {
    const host = await prisma.host.findUnique({
      where: { id },
    });

    if (!host) {
      console.error(`Host with id ${id} not found.`);
      throw new Error('Record to delete not found.');
    }
    
    const deletedHost = await prisma.host.delete({
      where: { id },
    });

    return deletedHost;
  } catch (error) {
    console.error("Error deleting host:", error);
    if (error.code === 'P2025') {
      throw new Error('Record to delete not found.');
    } else if (error.code === 'P2003') {
      throw new Error('Cannot delete host as it is referenced by other records.');
    } else {
      console.error("Error deleting host:", error);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
};

export default deleteHostById
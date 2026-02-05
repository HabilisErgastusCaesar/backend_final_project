import { PrismaClient } from "@prisma/client"

const updateHostById = async (id, update) => {
  console.log(id)
  console.log(update)
    const prisma = new PrismaClient()
    
    try {
        const host = await prisma.host.update({
          where: { id },
          data: update,
        });
        return host;
    } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('A host with this username already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Host to update not found.');
        } else {
          console.error("Error updating host:", error);
          throw error;
        }
    } finally {
        await prisma.$disconnect();
    }
}

export default updateHostById
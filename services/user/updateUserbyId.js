import { PrismaClient } from "@prisma/client"

const updateUserById = async (id, update) => {
    const prisma = new PrismaClient()
    try {
        const user = await prisma.user.update({
          where: { id },
          data: update,
        });
        return user;
      } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('A user with this username already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Record to update not found.');
        } else {
          console.error("Error updating user:", error);
          throw error;
        }
      } finally {
        await prisma.$disconnect();
      }
}

export default updateUserById
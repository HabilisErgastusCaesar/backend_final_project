import { PrismaClient } from "@prisma/client"

const deleteUserById = async (id) => {
    const prisma = new PrismaClient()
    
    try {
      await prisma.review.deleteMany({
        where: { userId: id },
      });

      await prisma.booking.deleteMany({
        where: { userId: id },
      });

      const user = await prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Record to delete not found.');
      } else {
        console.error("Error deleting user:", error);
        throw error;
      }
    } finally {
      await prisma.$disconnect();
    }
}

export default deleteUserById
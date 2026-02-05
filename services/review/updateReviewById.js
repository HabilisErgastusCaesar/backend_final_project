import { PrismaClient } from "@prisma/client"

const updateReviewById = async (id, update) => {
    const prisma = new PrismaClient()
    try {
        const review = await prisma.review.update({
          where: { id },
          data: update,
        });
        return review;
      } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('A review with this ID already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Record to update not found.');
        } else {
          console.error("Error updating review:", error);
          throw error;
        }
      } finally {
        await prisma.$disconnect();
      }
}

export default updateReviewById
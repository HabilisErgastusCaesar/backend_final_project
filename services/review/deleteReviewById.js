import { PrismaClient } from "@prisma/client"

const deleteReviewById = async (id) => {
  const prisma = new PrismaClient()
    
  try {
   const review = await prisma.review.delete({
    where: { id },
    });
    return review;
  } catch (error) {
   if (error.code === 'P2025') {
    throw new Error('Record to delete not found.');
    } else {
      console.error("Error deleting review:", error);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

export default deleteReviewById
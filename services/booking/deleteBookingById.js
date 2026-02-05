import { PrismaClient } from "@prisma/client"

const deleteBookingById = async (id) => {
    const prisma = new PrismaClient()
    
    try {
      const booking = await prisma.booking.delete({
        where: { id },
      });
      return booking;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Record to delete not found.');
      } else {
        console.error("Error deleting booking:", error);
        throw error;
      }
    } finally {
      await prisma.$disconnect();
    }
}

export default deleteBookingById
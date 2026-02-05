import { PrismaClient } from "@prisma/client"

const updateBookingById = async (id, update) => {
    const prisma = new PrismaClient()
    
    try {
        const booking = await prisma.booking.update({
          where: { id },
          data: update,
        });
        return booking;
    } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('A booking with this ID already exists.');
        } else if (error.code === 'P2003') {
          throw new Error('Foreign key constraint failed.');
        } else if (error.code === 'P2025') {
          throw new Error('Record to update not found.');
        } else {
          console.error("Error updating booking:", error);
          throw error;
        }
    } finally {
        await prisma.$disconnect();
    }
}

export default updateBookingById
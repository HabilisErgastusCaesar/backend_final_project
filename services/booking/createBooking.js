import { PrismaClient } from "@prisma/client"

const createBooking = async (create) => {
    const prisma = new PrismaClient()
    
    try {
        const booking = await prisma.booking.create({
          data: create,
        });
        return booking;
    } catch (error) {
      if (error.name === 'PrismaClientValidationError') {
        throw new Error('Validation error: ' + error.message);
      } else if (error.code === 'P2002') {
        throw new Error('A booking with this ID already exists.');
      } else if (error.code === 'P2003') {
        throw new Error('Foreign key constraint failed.');
      } else if (error.code === 'P2025') {
        throw new Error('Record to update not found.');
      } else {
        console.error("Error creating booking:", error);
        throw error;
      }
    } finally {
        await prisma.$disconnect();
    }
}

export default createBooking
import { PrismaClient } from "@prisma/client"

const getBooking = async (query) => {
    const prisma = new PrismaClient()
    
    return prisma.booking.findMany({
        where: query
      })
}

export default getBooking
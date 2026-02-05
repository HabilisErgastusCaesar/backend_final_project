import { PrismaClient } from "@prisma/client"

const getAmenity = async (query) => {
    const prisma = new PrismaClient()
    
    return prisma.amenity.findMany({
        where: query
      })
}

export default getAmenity
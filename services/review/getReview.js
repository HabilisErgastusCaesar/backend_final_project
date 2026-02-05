import { PrismaClient } from "@prisma/client"

const getReview = async () => {
    const prisma = new PrismaClient()
    return prisma.review.findMany({
        
      })
}

export default getReview
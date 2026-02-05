import { PrismaClient } from "@prisma/client"

const getHost = async (query) => {
    const prisma = new PrismaClient();
    const { name } = query;

    const where = {};

    if (name) {
        where.name = name;
    }
    return prisma.host.findMany({
        where,
    })
}

export default getHost
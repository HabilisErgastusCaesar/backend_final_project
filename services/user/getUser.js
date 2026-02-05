import { PrismaClient } from "@prisma/client"

const getUser = async (query) => {
  const prisma = new PrismaClient();
  const { email, username } = query;

  const where = {};

  if (email) {
    where.email = email;
  }

  if (username) {
    where.username = username;
  }
  return prisma.user.findMany({
    where,
  })
}

export default getUser
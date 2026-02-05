import { PrismaClient } from "@prisma/client"

const getProperty = async (query) => {
    const prisma = new PrismaClient();

    const { location, pricePerNight, amenities } = query;

    const where = {};

    if (location) {
        where.location = location;
    }

    if (pricePerNight) {
      where.pricePerNight = parseFloat(pricePerNight);
    }

    if (amenities) {
        where.amenities = {
        some: {
            amenity: {
                name: amenities,
              },
        },
        };
    }

    try {
      const properties = await prisma.property.findMany({
        where,
        include: {
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      });
      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
}

export default getProperty
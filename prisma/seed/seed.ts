import { PrismaClient } from '@prisma/client';

import brandNames from './data/brands';
import cityNames from './data/cities';
import dietNames from './data/diets';
import dishTypeNames from './data/dish-types';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const brands = await Promise.all(
    brandNames.map((name) => {
      return prisma.brand.upsert({
        update: {},
        where: { name } as any,
        create: {
          name,
        },
      });
    }),
  );
  const cities = await Promise.all(
    cityNames.map((name) => {
      return prisma.city.upsert({
        update: {},
        where: { name } as any,
        create: {
          name,
        },
      });
    }),
  );

  const diets = await Promise.all(
    dietNames.map((name) => {
      return prisma.diet.upsert({
        update: {},
        where: { name } as any,
        create: {
          name,
        },
      });
    }),
  );

  const dishTypes = await Promise.all(
    dishTypeNames.map((name) => {
      return prisma.dishType.upsert({
        update: {},
        where: { name } as any,
        create: {
          name,
        },
      });
    }),
  );

  console.log('Seeding data results:', { brands, cities, diets, dishTypes });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

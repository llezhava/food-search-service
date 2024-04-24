import { PrismaClient } from '@prisma/client';

import brandNames from './data/brands';
import cityNames from './data/cities';
import dietNames from './data/diets';
import dishTypeNames from './data/dish-types';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.createMany({
    data: brandNames.map((name) => ({ name })),
  });

  const cities = await prisma.city.createMany({
    data: cityNames.map((name) => ({ name })),
  });

  const diets = await prisma.diet.createMany({
    data: dietNames.map((name) => ({ name })),
  });

  const dishTypes = await prisma.dishType.createMany({
    data: dishTypeNames.map((name) => ({ name })),
  });

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

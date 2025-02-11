import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Example: Seeding a user
    await prisma.user.createMany({
        data: [
          {
            hashedUsername: 'b20459ab886e03b9a00f952b4e2adc167f9af9b53b0909860e9c58c2f1cecd60',
            lastFinishedAt: BigInt(1738740296),
            finishedCount: 1,
          },
          {
            hashedUsername: 'dc91c708c14252cc43b5d7255d63f9474514864ec43caa2a53b56ecbe2a4f699',
            lastFinishedAt: BigInt(1),
            finishedCount: 0,
          },
        ],
        skipDuplicates: true, // ✅ Avoids duplicate errors
      });

    // Add more seeding logic as needed
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

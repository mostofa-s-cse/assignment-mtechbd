import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
async function main() {
  const superAdminRole = await prisma.roles.createMany({
    data: [
      {
        id: 1,
        role: 'SUPER_ADMIN',
        context: 'MT',
      },
      {
        id: 2,
        role: 'ADMIN',
        context: 'MT',
      },
      {
        id: 3,
        role: 'MANAGER',
        context: 'MT',
      },
      {
        id: 4,
        role: 'DEVELOPER',
        context: 'MT',
      },
      {
        id: 5,
        role: 'ADMIN',
        context: 'CLIENT',
      },
      {
        id: 6,
        role: 'USER',
        context: 'CLIENT',
      },
    ],
  });

  const passwordHashed = await argon2.hash('123456');

  const abir = await prisma.users.upsert({
    where: { email: 'abir@manush.tech' },
    update: {},
    create: {
      uid: 'MANUSH-123987',
      email: 'abir@manush.tech',
      phone: '01711355057',
      name: 'Abir Rahman',
      password: passwordHashed,
      userWeight: 10,
      roleId: 1,
      isMfaEnabled: false,
      isPasswordValid: true,
      isPasswordResetRequired: false,
      lastPasswordResetDate: new Date(),
    },
  });
  console.log({ abir, superAdminRole });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

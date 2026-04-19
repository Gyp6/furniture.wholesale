// apps/backend/src/app/auth/auth.instance.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';

import { emailAndPasswordConfig } from '@/core/config';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

export const createAuth = (prisma: PrismaService) => {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    hooks: {},
    // databaseHooks: {
    //   user: {
    //     create: {
    //       before: user => {
    //         const { companyName, taxId, type, ...cleanUser } = user as any;
    //         return { data: cleanUser };
    //       },
    //     },
    //   },
    // },
    user: {
      additionalFields: {
        // Додаємо цей прапор, щоб BA не намагався зберегти це в таблицю User
        // companyName: {
        //   type: 'string',
        //   input: true,
        //   mapToDatabase: false,
        // },
        // taxId: {
        //   type: 'string',
        //   input: true,
        //   mapToDatabase: false,
        // },
        // type: {
        //   // Не забудь додати type, якщо ти його шлеш
        //   type: 'string',
        //   input: true,
        //   mapToDatabase: false,
        // },
        companyId: {
          type: 'string',
          input: false,
        },
      },
    },
    plugins: [
      admin({
        isDefaultAdmin: user => user.role === 'ADMIN',
        defaultRole: 'RETAILER',
      }),
    ],
    emailAndPassword: emailAndPasswordConfig,
    trustedProxies: true,
    trustedOrigins: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://web:3000',
      'http://backend:4200',
    ],
    advanced: {
      disableOriginCheck: process.env.MODE_ENV === 'development',
      disableCSRFCheck: process.env.MODE_ENV === 'development',
    },
    allowDangerousConnections: process.env.MODE_ENV === 'development',
  });
};

export type Auth = ReturnType<typeof createAuth>;

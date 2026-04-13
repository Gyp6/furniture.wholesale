// apps/backend/src/app/auth/auth.instance.ts
import { ac, rolePermissions } from '@gyp6.sale/core/auth/permissions';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';

import { emailAndPasswordConfig } from '@/core/config';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

export const createAuth = (
  prisma: PrismaService,
  configService: ConfigService,
) => {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    plugins: [
      admin({
        ac: ac as any,
        roles: rolePermissions,
        isDefaultAdmin: user => user.role === 'ADMIN',
        defaultRole: 'RETAILER',
        schema: {
          user: {
            fields: {
              role: 'role',
            },
          },
        },
      }),
    ],
    emailAndPassword: emailAndPasswordConfig,
    trustedProxies: true, // <--- ДОДАЙ ЦЕ
    trustedOrigins: [
      'http://localhost:3000',
      'http://web:3000', // Ім'я контейнера фронта
      'http://backend:4200', // На всякий випадок
    ],
  });
};

export const auth = betterAuth({
  database: prismaAdapter(
    {},
    {
      provider: 'postgresql',
    },
  ),
  plugins: [admin()],
  emailAndPassword: emailAndPasswordConfig,
  trustedProxies: true, // <--- ДОДАЙ ЦЕ
  trustedOrigins: [
    'http://localhost:3000',
    'http://web:3000', // Ім'я контейнера фронта
    'http://backend:4200', // На всякий випадок
  ],
});

export type Auth = ReturnType<typeof createAuth>;

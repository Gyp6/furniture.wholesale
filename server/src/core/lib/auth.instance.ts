// apps/backend/src/app/auth/auth.instance.ts
import { ConfigService } from '@nestjs/config';
import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { Queue } from 'bullmq';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { AUTH_LIMITS, ROLES } from '@/shared/constants';

export const createAuth = (
  prismaService: PrismaService,
  configService: ConfigService,
  mailQueue: Queue,
) => {
  return betterAuth({
    database: prismaAdapter(prismaService, {
      provider: 'postgresql',
    }),
    hooks: {},
    databaseHooks: {
      user: {
        create: {
          before: (userData, ctx) => {
            const body = ctx?.body;

            // OAuth юзери приходять з emailVerified: true
            // Email реєстрація завжди emailVerified: false
            const isOAuthRegistration =
              userData.emailVerified === true && !body?.password;

            if (isOAuthRegistration) {
              throw new APIError('FORBIDDEN', {
                message:
                  'Registration via social networks is not allowed. Please register with email.',
                code: 'SOCIAL_REGISTRATION_NOT_ALLOWED',
              });
            }

            const role = body?.type;

            if (role) {
              return Promise.resolve({ data: { ...userData, role } });
            }

            return Promise.resolve({ data: userData });
          },
        },
      },
    },
    user: {
      additionalFields: {
        companyId: {
          type: 'string',
          input: false,
        },
      },
    },

    plugins: [
      admin({
        isDefaultAdmin: user => user.role === 'ADMIN',
        defaultRole: ROLES.RETAILER,
      }),
    ],
    socialProviders: {
      google: {
        clientId: configService.getOrThrow('GOOGLE_CLIENT_ID'),
        clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      },
      // apple: {
      //   clientId: configService.getOrThrow('APPLE_CLIENT_ID'),
      //   clientSecret: configService.getOrThrow('APPLE_CLIENT_SECRET'),
      // },
      facebook: {
        clientId: configService.getOrThrow('FACEBOOK_CLIENT_ID'),
        clientSecret: configService.getOrThrow('FACEBOOK_CLIENT_SECRET'),
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: AUTH_LIMITS.MIN_PASSWORD_LENGTH,
      maxPasswordLength: AUTH_LIMITS.MAX_PASSWORD_LENGTH,
      sendResetPassword: async ({ user, url }) => {
        await mailQueue.add('send_mail', {
          to: user.email,
          subject: 'Reset Your Password',
          html: `
            <h1>Password Reset</h1>
            <p>Click the link to reset your password:</p>
            <a href="${url}">Reset Password</a>
          `,
        });
      },
    },
    trustedProxies: true,
    trustedOrigins: ['http://localhost:3000', 'http://web:3000'],
    advanced: {
      disableOriginCheck: process.env.NODE_ENV === 'development',
      disableCSRFCheck: process.env.NODE_ENV === 'development',
    },
    allowDangerousConnections: process.env.NODE_ENV === 'development',
  });
};

export type Auth = ReturnType<typeof createAuth>;

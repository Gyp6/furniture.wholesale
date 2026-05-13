// apps/backend/src/core/lib/auth.instance.ts
import { ConfigService } from '@nestjs/config';
import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';

import { AUTH_LIMITS, ROLES } from '@/common/constants';
import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

export const createAuth = (
  prismaService: PrismaService,
  configService: ConfigService,
  mailService: MailService,
) => {
  return betterAuth({
    database: prismaAdapter(prismaService, {
      provider: 'postgresql',
    }),
    baseURL: configService.getOrThrow('BACKEND_URL'),
    basePath: '/api/v1/auth',
    trustedOrigins: [configService.getOrThrow('FRONTEND_URL')],
    trustedProxies: true,
    hooks: {},
    databaseHooks: {
      user: {
        create: {
          before: (userData, ctx) => {
            const body = ctx?.body;

            const isOAuthRegistration =
              userData.emailVerified === true && !body?.password;

            if (isOAuthRegistration) {
              throw new APIError('FORBIDDEN', {
                message: 'oauth_registration_not_allowed',
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
        await mailService.sendResetPassword(user.email, url);
      },
    },
    advanced: {
      disableOriginCheck: process.env.NODE_ENV === 'development',
      disableCSRFCheck: process.env.NODE_ENV === 'development',
    },
    allowDangerousConnections: process.env.NODE_ENV === 'development',
  });
};

export type Auth = ReturnType<typeof createAuth>;

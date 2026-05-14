import { cacheLife, cacheTag } from 'next/cache';
import { headers } from 'next/headers';
import { cache } from 'react';

import { authClient } from '@/lib';

interface SessionData {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
  };
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
    impersonatedBy?: string | null | undefined;
  };
}

const data: SessionData = {
  session: {
    expiresAt: new Date('2026-05-21T15:46:26.742Z'),
    token: 'cxnHGpcJ0IeFI4HQValP7BH5Q0r5MvVq',
    createdAt: new Date('2026-05-08T08:34:26.771Z'),
    updatedAt: new Date('2026-05-14T15:46:26.742Z'),
    ipAddress: '',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0',
    userId: '74fR204dTo1AIgBpZXfeKKXDIuM2JoXL',
    impersonatedBy: null,
    id: 'bUh5w1b2yI6wa2gHHfoygerXtjgRCnC9',
  },
  user: {
    name: 'Yanbellq',
    email: 'yanbellq@gmail.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2026-05-07T16:28:49.512Z'),
    updatedAt: new Date('2026-05-07T16:29:40.323Z'),
    role: 'HORECA',
    banned: false,
    banReason: null,
    banExpires: null,
    id: '74fR204dTo1AIgBpZXfeKKXDIuM2JoXL',
  },
};

// const getSessionLogic = async (cookieString: string) => {
//   "use cache";

//   const { data } = await authClient.getSession({
//     fetchOptions: {
//       headers: { cookie: cookieString }
//     },
//   });

//   console.log(data);

//   cacheTag('session');
//   cacheLife('minutes');
//   return data;
// };

// export const getServerSession = cache(async () => {
//   const h = await headers();
//   const cookie = h.get('cookie') || '';

//   return await getSessionLogic(cookie);
// });

export const getServerSession = async () => {
  return data;
};

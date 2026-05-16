import { HORECA_TYPE } from '@/constants';

export type THoReCa = (typeof HORECA_TYPE)[keyof typeof HORECA_TYPE];

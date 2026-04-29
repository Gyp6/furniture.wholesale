import { HORECA_TYPE } from '@/shared/constants';

export type THoReCa = (typeof HORECA_TYPE)[keyof typeof HORECA_TYPE];

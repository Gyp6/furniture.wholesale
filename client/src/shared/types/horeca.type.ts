import { HORECA_TYPE } from '@/constants/horeca.constant'

export type THoReCa = (typeof HORECA_TYPE)[keyof typeof HORECA_TYPE];

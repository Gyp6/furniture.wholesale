import { EHoReCaType } from '@/shared/enums';

export const HORECA_TYPE = {
  HOTEL: EHoReCaType.HOTEL.toUpperCase(),
  RESTAURANT: EHoReCaType.RESTAURANT.toUpperCase(),
  CAFE: EHoReCaType.CAFE.toUpperCase(),
  BAR: EHoReCaType.BAR.toUpperCase(),
  COWORKING: EHoReCaType.COWORKING.toUpperCase(),
  OFFICE: EHoReCaType.OFFICE.toUpperCase(),
} as const;

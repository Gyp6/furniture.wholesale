import {
  IsHash,
  IsName,
  IsRatingAvg,
  IsSpecialisations,
  IsVerified,
} from '@/common/validators';

export class ManufacturerResponse {
  @IsHash({ title: 'id' })
  id!: string;

  @IsName()
  name!: string;

  @IsSpecialisations()
  specializations!: string[];

  @IsVerified()
  isVerified!: boolean;

  @IsRatingAvg()
  ratingAvg!: number;
}

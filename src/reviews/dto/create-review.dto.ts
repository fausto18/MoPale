import { IsInt, IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  propertyId!: number;

  @IsInt()
  userId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}

import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class SearchCriteriaDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productType?: string;

  @IsNumberString()
  latitude: string;

  @IsNumberString()
  longitude: string;
}
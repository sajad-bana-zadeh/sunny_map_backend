import { IsString, IsNumber, IsArray, IsObject, ValidateNested, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

class InventoryDto {
  @IsString()
  productName: string;

  @IsString()
  productType: string;

  @IsNumber()
  quantity: number;
}

class ContactInfoDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

export class CreatePointDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryDto)
  inventory: InventoryDto[];

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
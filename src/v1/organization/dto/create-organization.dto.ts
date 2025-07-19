import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactInfoDto } from './contact-info.dto';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{4}\d{3}$/, {
    message: 'organizationId must be 4 uppercase letters followed by 3 digits',
  })
  organizationId: string;
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsString()
  @IsNotEmpty()
  organizationType: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;

  @IsOptional()
  @IsString()
  logo?: string; // file path

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // file paths
}

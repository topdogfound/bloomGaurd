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
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{4}\d{3}$/, {
    message: 'organizationId must be 4 uppercase letters followed by 3 digits',
  })
  @ApiProperty({
    description: 'Unique organization ID in the format XXXX123',
    example: 'ABCD123',
  })
  organizationId: string;
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    description: 'Type of the organization',
    example: 'Non-Profit',
  })
  @IsString()
  @IsNotEmpty()
  organizationType: string;

  @ApiProperty({
    description: 'Contact information for the organization',
    type: ContactInfoDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;

  @ApiProperty({
    description: 'Logo of the organization (file path)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string; // file path

  @ApiProperty({
    description: 'Images associated with the organization (file paths)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // file paths
}

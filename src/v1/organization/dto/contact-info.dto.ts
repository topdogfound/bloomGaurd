import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ContactInfoDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email address for the contact person',
    example: 'abcd@gmail.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Phone number for the contact person',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Physical address for the contact person',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}

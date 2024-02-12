import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class UpdateMagazineDto {
  @ApiProperty({ 
    description: 'Title of the magazine',
    example: 'Tech Today' 
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ 
    description: 'Description of the magazine',
    example: 'Stay updated with the latest tech news and trends.' 
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ 
    description: 'Price of the magazine',
    example: 9.99 
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;
}

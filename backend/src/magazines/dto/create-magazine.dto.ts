import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMagazineDto {
  @ApiProperty({ 
    description: 'Title of the magazine',
    example: 'Tech Today' 
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'Description of the magazine',
    example: 'Stay updated with the latest tech news and trends.' 
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Price of the magazine',
    example: 9.99 
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

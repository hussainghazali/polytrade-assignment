import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user email',
    minLength: 1,
    maxLength: 255,
    example: 'user@finsight.sa',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user firstname',
    minLength: 1,
    maxLength: 255,
    example: 'Hussain',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user lastname',
    minLength: 1,
    maxLength: 255,
    example: 'Ghazali',
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    description: 'new user password',
    minLength: 6,
    maxLength: 128,
    example: 'password',
  })
  password: string;
}

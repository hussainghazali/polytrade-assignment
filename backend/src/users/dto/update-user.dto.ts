import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsNumberString,
  Matches,
  IsString,
  IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'f6b0f8c0-2575-4a1b-9c0f-1b8a9a5c8e1c',
  })
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  @ApiProperty({
    description: "new user email",
    minLength: 1,
    maxLength: 255,
    example: "user@guardlink.sa",
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: "new user firstname",
    minLength: 1,
    maxLength: 255,
    example: "Saud",
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: "new user lastname",
    minLength: 1,
    maxLength: 255,
    example: "Ali",
  })
  lastName: string;
}

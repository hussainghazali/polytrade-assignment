import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, Length } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  @ApiProperty({
    example: 'user@finsight.sa',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    example: "password",
  })
  password: string;
}

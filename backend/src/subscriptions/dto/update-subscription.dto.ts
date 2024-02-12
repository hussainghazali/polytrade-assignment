import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'The start date of the subscription (optional)',
    example: '2024-02-15T12:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'The end date of the subscription (optional)',
    example: '2024-03-15T12:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Flag indicating if the subscription is cancelled (optional)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  cancelled?: boolean;
}

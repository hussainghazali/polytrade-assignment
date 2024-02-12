import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID, IsBoolean } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the magazine being subscribed to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  magazineId: string;

  @ApiProperty({
    description: 'The start date of the subscription',
    example: '2024-02-15T12:00:00Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the subscription (optional)',
    example: '2024-03-15T12:00:00Z',
    required: false,
  })
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    description: 'Flag indicating if the subscription is cancelled',
    example: false,
    required: false,
  })
  @IsBoolean()
  cancelled?: boolean;
}

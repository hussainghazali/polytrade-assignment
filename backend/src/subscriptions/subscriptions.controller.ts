import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Roles } from 'src/middleware/roles.decorator';
import { RolesGuard } from 'src/middleware/roles.guard';
import { Role } from 'src/middleware/role.enum';
import { JwtPayload } from 'src/auth/auth.service';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create Subscription' })
  @ApiResponse({ status: 200, description: 'Subscription CREATED' })
  @ApiResponse({ status: 400, description: 'BAD REQUEST' })
  async createSubscription(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const { sub } = req.user as JwtPayload;
    const result = await this.subscriptionsService.create(
      sub,
      createSubscriptionDto,
    );
    return { success: true, data: result };
  }

  @Put(':subscriptionId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update Subscription By ID' })
  @ApiResponse({ status: 200, description: 'Subscription UPDATED' })
  @ApiResponse({ status: 400, description: 'BAD REQUEST' })
  async updateSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    try {
      const result = await this.subscriptionsService.update(
        subscriptionId,
        updateSubscriptionDto,
      );
      // Returning a success response with HTTP status code 200 (OK)
      return { success: true, data: result, statusCode: HttpStatus.OK };
    } catch (error) {
      console.error('Error occurred:', error.message);
      // Throwing a Bad Request exception with HTTP status code 400
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Get()
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get All Subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions FETCHED' })
  @ApiResponse({ status: 404, description: 'NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async getAllSubscriptions() {
    const Subscriptions = await this.subscriptionsService.findAll();
    return {
      success: true,
      data: Subscriptions,
    };
  }

  @Get(':subscriptionId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get Subscription By ID' })
  @ApiResponse({ status: 200, description: 'Subscription FETCHED' })
  @ApiResponse({ status: 404, description: 'NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async getSubscriptions(@Request() req, @Param('subscriptionId') subscriptionId: string) {
    try {
      if (subscriptionId) {
        const currentSubscription = await this.subscriptionsService.findById(
          subscriptionId,
        );

        if (!currentSubscription) {
          // If no Subscription found with the given ID, throw a Not Found exception with status code 404
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No Subscription found',
          });
        }

        // Return the found Subscription
        return { data: currentSubscription, statusCode: HttpStatus.OK };
      } else {
        const allSubscriptions = await this.subscriptionsService.findAll();

        // Return all Subscriptions
        return { data: allSubscriptions, statusCode: HttpStatus.OK };
      }
    } catch (error) {
      console.error('Error occurred while retrieving Subscriptions:', error);

      // Throw an Internal Server Error with status code 500
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Get('users/:userId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get Subscriptions for the User' })
  @ApiResponse({ status: 200, description: 'Subscriptions FETCHED' })
  @ApiResponse({ status: 404, description: 'NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async getSubscriptionsForUser(@Param('userId') userId: string, @Request() req) {
    try {
      const currentSubscription = await this.subscriptionsService.findByUserId(
        userId,
      );

      if (!currentSubscription) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Subscriptions found',
        });
      }

      return { data: currentSubscription, statusCode: HttpStatus.OK };
    } catch (error) {
      console.error('Error occurred while retrieving Subscriptions:', error);

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Delete(':SubscriptionId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete Subscription By ID' })
  @ApiResponse({ status: 200, description: 'Subscription DELETED' })
  @ApiResponse({ status: 404, description: 'NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async deleteSubscription(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    try {
      const deletedSubscription = await this.subscriptionsService.deleteById(
        subscriptionId,
      );

      if (!deletedSubscription) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Subscription found',
        });
      }

      return { data: deletedSubscription, statusCode: HttpStatus.OK };
    } catch (error) {
      console.error('Error occurred while deleting Subscription:', error);

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }
}

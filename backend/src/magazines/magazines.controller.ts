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
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { MagazinesService } from './magazines.service';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { RolesGuard } from 'src/middleware/roles.guard';
import { Role } from 'src/middleware/role.enum';
import { Roles } from 'src/middleware/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtPayload } from 'src/auth/auth.service';

@ApiTags('Magazines')
@ApiBearerAuth()
@Controller('magazines')
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @Post()
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create Magazine' })
  @ApiResponse({
    status: 201,
    description: 'Magazine CREATED',
  })
  @ApiResponse({
    status: 400,
    description: 'BAD REQUEST',
  })
  @UseInterceptors(FileInterceptor('file'))
  async createMagazine(
    @Body() createMagazineDto: CreateMagazineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.magazinesService.create(
        createMagazineDto,
        file,
      );
      return { success: true, data: result, statusCode: HttpStatus.CREATED };
    } catch (error) {
      console.error('Error occurred:', error.message);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Put(':magazineId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update Magazine By ID' })
  @ApiResponse({ status: 200, description: 'Magazine UPDATED' })
  @ApiResponse({
    status: 400,
    description: 'BAD REQUEST',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateMagazine(
    @Param('magazineId') magazineId: string,
    @Body() updateMagazineDto: UpdateMagazineDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.magazinesService.update(
        magazineId,
        updateMagazineDto,
        file,
      );
      return { success: true, data: result, statusCode: HttpStatus.OK };
    } catch (error) {
      console.error('Error occurred:', error.message);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Get()
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get All Magazines' })
  @ApiResponse({ status: 200, description: 'Magazines FETCHED' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async getAllMagazines() {
    const allMagazines = await this.magazinesService.findAll();

    return {
      success: true,
      data: allMagazines,
    };
  }

  @Get(':magazineId')
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get Magazine By ID' })
  @ApiResponse({ status: 200, description: 'Magazine FETCHED' })
  @ApiResponse({ status: 404, description: 'Magazine NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async getMagazines(@Param('magazineId') magazineId: string) {
    try {
      if (magazineId) {
        const currentMagazine = await this.magazinesService.findById(
          magazineId,
        );

        if (!currentMagazine) {
          throw new NotFoundException('No Magazine found');
        }

        return {
          data: currentMagazine,
          statusCode: HttpStatus.OK,
        };
      }

      const allMagazines = await this.magazinesService.findAll();

      return {
        data: allMagazines,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error occurred while retrieving Magazines:', error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Delete(':magazineId') // Updated endpoint with a parameter named MagazineId
  @Roles(Role.POLYTRADE_CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete Magazine By ID' })
  @ApiResponse({ status: 200, description: 'Magazine DELETED' })
  @ApiResponse({ status: 404, description: 'Magazine NOT FOUND' })
  @ApiResponse({ status: 500, description: 'ERROR' })
  async deleteMagazine(@Param('magazineId') magazineId: string) {
    try {
      const deletedMagazine = await this.magazinesService.deleteById(
        magazineId,
      );

      if (!deletedMagazine) {
        throw new NotFoundException('No Magazine found');
      }

      return {
        data: deletedMagazine,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error occurred while deleting Magazine:', error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Request,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/middleware/roles.decorator';
import { Role } from 'src/middleware/role.enum';
import { RolesGuard } from 'src/middleware/roles.guard';
import { LogsService } from 'src/logs/logs.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LogsService,
    ) {}

  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log('Registering a User', 'UsersController');
    return this.usersService.register(registerUserDto);
  }

  @Public()
  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('Updating a User', 'UsersController');
    return this.usersService.update(updateUserDto, file);
  }

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log('Logging a User', 'UsersController');
    return this.usersService.login(loginUserDto);
  }

  private tokenBlacklist: Set<string> = new Set(); // In-memory token blacklist

  @Post('logout')
  logout(@Request() req) {
    const { sub } = req.user as JwtPayload;
    if (!sub) {
      throw new UnauthorizedException('Invalid token');
    }

    // Add the token to the blacklist
    this.tokenBlacklist.add(sub);

    this.logger.log('User Logged Out', 'UsersController');
    return { message: 'Session expired successfully' };
  }

  @Get('me')
  @Roles(
    Role.POLYTRADE_CUSTOMER
  )
  @UseGuards(RolesGuard)
  myProfile(@Req() req: any) {
    const { sub } = req.user as JwtPayload;
    this.logger.log('Fetching User Profile', 'UsersController');
    return this.usersService.myProfile(sub);
  }
}

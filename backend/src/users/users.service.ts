import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FilesService } from 'src/files/files.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly filesService: FilesService,
    private authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const payload = await this.authService.register(registerUserDto);

    return payload;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const payload = await this.authService.login(email, password);

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return payload;
  }

  async update(
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    let fileUpload: any;

    if (file) {
      fileUpload = file && (await this.filesService.create(file));
    }

    const { userId, firstName, lastName, email } = updateUserDto;

    // Find the current shift by shiftNumber
    const currentUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      return {
        message: 'No user found',
        data: [],
      };
    }

    // Update the properties of the fetched shift entity
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;

    try {
      const updatedUser = await this.usersRepository.save(currentUser);
      return {
        user: updatedUser,
      };
    } catch (error) {
      return {
        message: 'No user found',
        data: [],
        error,
      };
    }
  }

  async myProfile(userId: string) {
    const payload = await this.authService.getProfile(userId);
    if (!payload) {
      throw new NotFoundException('User not found');
    }

    return { ...payload, id: payload.sub };
  }
}

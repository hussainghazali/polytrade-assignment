import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { config } from 'dotenv';
import { Role } from 'src/middleware/role.enum';

config(); // Load environment variables from .env file

export type JwtPayload = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  roles: Role[];
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, firstName, lastName } =
      registerUserDto;
    const user = await this.userRepository.save({
      email,
      firstName,
      lastName,
      password: await bcrypt.hash(password, 10),
      roles: [Role.POLYTRADE_CUSTOMER],
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h',
    });

    return {
      access_token: accessToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    const payload = await this.getProfile(user.id);
    return {
      access_token: await this.jwtService.signAsync(payload),
      profile: payload,
    };
  }

  async getProfile(userId: string): Promise<JwtPayload | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
    };

    return payload;
  }

  verifyToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token);
  }
}

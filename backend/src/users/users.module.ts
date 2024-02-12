import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { FilesModule } from "src/files/files.module";
import { LogsModule } from "src/logs/logs.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, FilesModule, LogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

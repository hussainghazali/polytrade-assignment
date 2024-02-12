import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MagazinesService } from "./magazines.service";
import { MagazinesController } from "./magazines.controller";
import { Magazine } from "./entities/magazine.entity";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([Magazine]), FilesModule],
  controllers: [MagazinesController],
  providers: [MagazinesService],
})
export class MagazinesModule {}

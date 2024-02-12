import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { UploadFileDto } from "./dto/upload-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("files")
@ApiBearerAuth()
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto
  ) {
    return this.filesService.create(file);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { File } from './entites/file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(uploadFileDto: Express.Multer.File): Promise<File> {
    const upload = await this.fileRepository.create({
      filename: uploadFileDto.originalname,
      data: uploadFileDto.buffer,
    });
    await this.fileRepository.save(upload);
    return upload;
  }

  findAll() {
    return `This action returns all uploads`;
  }

  async findOne(id: string) {
    if (!id) {
      return null; // Return null if ID is null or undefined
    }

    const file = await this.fileRepository.findOne({ where: { id } });
    return file || null; // Return null if file is not found for the given ID
  }

  update(id: string, updateUploadFileDto: UpdateUploadFileDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: string) {
    return `This action removes a #${id} upload`;
  }

  private readonly uploadDirectory = '../../uploads/';

  generateFileURL(data: any): string {
    if (!data?.data || !data.filename) {
      throw new Error('Invalid file data');
    }

    // Decode Base64 data to binary (buffer)
    const fileBuffer = Buffer.from(data.data, 'base64');

    // Define the uploads directory
    const uploadsDirectory = path.join(__dirname, this.uploadDirectory);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(uploadsDirectory, { recursive: true });
    }

    // Define the file path
    const filePath = path.join(uploadsDirectory, data.filename);

    // Write the buffer data to a file
    fs.writeFileSync(filePath, fileBuffer);

    // Generate a URL to access the file
    const serverURL = 'https://guardlink-api.onrender.com'; // Replace with your server URL
    const fileURL = `${serverURL}/uploads/${data.filename}`;

    return fileURL;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Magazine } from './entities/magazine.entity';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class MagazinesService {
  constructor(
    @InjectRepository(Magazine)
    private magazinesRepository: Repository<Magazine>,
    private readonly filesService: FilesService,
  ) {}

  async create(
    { title, description, price }: CreateMagazineDto,
    file?: Express.Multer.File,
  ) {
    let fileUpload;

    if (file) {
      fileUpload = file && (await this.filesService.create(file));
    }

    const Magazine = this.magazinesRepository.create({
      title,
      description,
      price,
      fileId: fileUpload ? fileUpload.id : null,
    });

    const saveMagazine = await this.magazinesRepository.save(Magazine);

    return saveMagazine;
  }

  async update(
    magazineId: string,
    { title, description, price }: UpdateMagazineDto,
    file?: Express.Multer.File,
  ) {
    let fileUpload;

    try {
      const currentMagazine = await this.magazinesRepository.findOneOrFail({
        where: { id: magazineId },
      });

      if (file) {
        fileUpload = file && (await this.filesService.create(file));
      }

      currentMagazine.title = title;
      currentMagazine.description = description;
      currentMagazine.price = price;
      currentMagazine.fileId = fileUpload ? fileUpload.id : currentMagazine.fileId;

      return this.magazinesRepository.save(currentMagazine);
    } catch (error) {
      throw new NotFoundException('No Magazine found');
    }
  }

  async findById(magazineId: string) {

    const MagazinePromise = this.magazinesRepository.find({
      where: { id: magazineId },
      relations: ['subscriptions'],
      order: { createdAt: 'DESC' },
    });

    const [Magazines] = await Promise.all([MagazinePromise]);

    const MagazinesWithData = Magazines.map(async (Magazine) => {
      const file = await this.filesService.findOne(Magazine.fileId);
      let fileURL: any = null;

      if (file?.data) {
        fileURL = this.filesService.generateFileURL(file);
      }

      const { id, title, description, price, createdAt, updatedAt, deletedAt } = Magazine;

      return {
        id,
        title,
        description,
        price,
        fileURL,
        subscription: Magazine,
        createdAt,
        updatedAt,
        deletedAt,
      };
    });

    const formattedMagazines = await Promise.all(MagazinesWithData);

    return {
      data: formattedMagazines,
    };
  }

  async findAll() {
    const MagazinesPromise = this.magazinesRepository.find({
      order: { createdAt: 'DESC' },
    });
    return MagazinesPromise;
  }

  async deleteById(
    magazineId: string,
  ): Promise<{ message: string }> {

    try {
      const Magazine = await this.magazinesRepository.findOneOrFail({
        where: { id: magazineId },
      });

      await this.magazinesRepository.remove(Magazine);

      return { message: 'Delete Successful' };
    } catch (error) {
      throw new NotFoundException('Failed: Magazine not found');
    }
  }
}

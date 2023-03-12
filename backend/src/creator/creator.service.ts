import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { Creator } from './entities/creator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private creatorRepository: Repository<Creator>,
  ) {}

  async save(createCreatorDto: CreateCreatorDto) {
    const { name } = createCreatorDto;
    const creator = await this.findByName(name);

    if (!creator) {
      return this.creatorRepository.save(createCreatorDto);
    }

    return creator;
  }

  findAll() {
    return this.creatorRepository.find();
  }

  findByName(name: string) {
    return this.creatorRepository.findOneBy({
      name: name,
    });
  }
}

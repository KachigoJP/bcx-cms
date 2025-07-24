import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentEntity } from './entity/component.entity';
import { CreateComponentDto, UpdateComponentDto } from './dto';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentEntity)
    private readonly componentRepo: Repository<ComponentEntity>,
  ) {}

  async createComponent(data: CreateComponentDto) {
    return this.componentRepo.save(this.componentRepo.create(data));
  }

  async updateComponent(id: string, data: UpdateComponentDto) {
    await this.componentRepo.update(id, data);
    return this.componentRepo.findOneBy({ id });
  }

  async deleteComponent(id: string) {
    return this.componentRepo.delete(id);
  }

  async getComponent(id: string) {
    return this.componentRepo.findOneBy({ id });
  }

  async listComponents() {
    return this.componentRepo.find();
  }
}

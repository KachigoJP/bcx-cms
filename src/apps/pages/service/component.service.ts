import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentEntity } from '../entity/component.entity';
import { PageComponentEntity } from '../entity/page-component.entity';
import { PageEntity } from '../entity/page.entity';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentEntity)
    private readonly componentRepo: Repository<ComponentEntity>,
    @InjectRepository(PageComponentEntity)
    private readonly pageComponentRepo: Repository<PageComponentEntity>,
    @InjectRepository(PageEntity)
    private readonly pageRepo: Repository<PageEntity>,
  ) {}

  // CRUD for components
  async createComponent(data: Partial<ComponentEntity>) {
    return this.componentRepo.save(this.componentRepo.create(data));
  }

  async updateComponent(id: string, data: Partial<ComponentEntity>) {
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

  // Add component to page
  async addComponentToPage(
    pageId: string,
    componentId: string,
    order: number,
    config?: Record<string, any>,
  ) {
    const page = await this.pageRepo.findOneBy({ id: pageId });
    const component = await this.componentRepo.findOneBy({ id: componentId });
    if (!page || !component)
      throw new NotFoundException('Page or Component not found');

    const pageComponent = this.pageComponentRepo.create({
      page,
      component,
      order,
    });
    return this.pageComponentRepo.save(pageComponent);
  }

  // Remove component from page
  async removeComponentFromPage(pageComponentId: string) {
    return this.pageComponentRepo.delete(pageComponentId);
  }

  // List components for a page
  async getPageComponents(pageId: string) {
    return this.pageComponentRepo.find({
      where: { page: { id: pageId } },
      order: { order: 'ASC' },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from '../entities/restaurante.entity';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectRepository(Restaurante)
    private restaurantesRepository: Repository<Restaurante>,
  ) {}

  async create(createDto: CreateRestauranteDto): Promise<Restaurante> {
    if (createDto.cnpj) {
      const existing = await this.restaurantesRepository.findOne({
        where: { cnpj: createDto.cnpj },
      });
      if (existing) {
        throw new ConflictException('Já existe um restaurante com este CNPJ');
      }
    }

    const restaurante = this.restaurantesRepository.create(createDto);
    return this.restaurantesRepository.save(restaurante);
  }

  async findAll(): Promise<Restaurante[]> {
    return this.restaurantesRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Restaurante> {
    const restaurante = await this.restaurantesRepository.findOne({
      where: { id },
    });
    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return restaurante;
  }

  async update(
    id: number,
    updateDto: UpdateRestauranteDto,
  ): Promise<Restaurante> {
    const restaurante = await this.findOne(id);

    if (updateDto.cnpj && updateDto.cnpj !== restaurante.cnpj) {
      const existing = await this.restaurantesRepository.findOne({
        where: { cnpj: updateDto.cnpj },
      });
      if (existing) {
        throw new ConflictException('Já existe um restaurante com este CNPJ');
      }
    }

    Object.assign(restaurante, updateDto);
    return this.restaurantesRepository.save(restaurante);
  }

  async remove(id: number): Promise<void> {
    const restaurante = await this.findOne(id);
    await this.restaurantesRepository.remove(restaurante);
  }
}

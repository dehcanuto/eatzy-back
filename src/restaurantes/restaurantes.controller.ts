import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Restaurante } from '../entities/restaurante.entity';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { RestauranteResponseDto } from './dto/restaurante-response.dto';

@ApiTags('Restaurantes')
@Controller('restaurantes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo restaurante' })
  async create(
    @Body() createDto: CreateRestauranteDto,
  ): Promise<RestauranteResponseDto> {
    const restaurante = await this.restaurantesService.create(createDto);
    return this.mapToResponseDto(restaurante);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os restaurantes' })
  async findAll(): Promise<RestauranteResponseDto[]> {
    const restaurantes = await this.restaurantesService.findAll();
    return restaurantes.map((r) => this.mapToResponseDto(r));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar restaurante por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RestauranteResponseDto> {
    const restaurante = await this.restaurantesService.findOne(id);
    return this.mapToResponseDto(restaurante);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar restaurante' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRestauranteDto,
  ): Promise<RestauranteResponseDto> {
    const restaurante = await this.restaurantesService.update(id, updateDto);
    return this.mapToResponseDto(restaurante);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover restaurante' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.restaurantesService.remove(id);
  }

  private mapToResponseDto(restaurante: Restaurante): RestauranteResponseDto {
    return {
      id: restaurante.id,
      nome: restaurante.nome,
      cnpj: restaurante.cnpj,
      telefone: restaurante.telefone,
      endereco: restaurante.endereco,
      logoUrl: restaurante.logoUrl,
      status: restaurante.status,
      createdAt: restaurante.createdAt,
      updatedAt: restaurante.updatedAt,
    };
  }
}

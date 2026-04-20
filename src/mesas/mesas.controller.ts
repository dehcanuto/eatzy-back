import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MesasService } from './mesas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { MesaResponseDto } from './dto/mesa-response.dto';
import { Mesa } from '../entities/mesa.entity';
import { EstatisticasMesas } from './mesas.service';

@ApiTags('mesas')
@Controller('mesas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as mesas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mesas retornada com sucesso',
    type: [MesaResponseDto],
  })
  async findAll(): Promise<Mesa[]> {
    return this.mesasService.findAll();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das mesas' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getEstatisticas(): Promise<EstatisticasMesas> {
    return this.mesasService.getEstatisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mesa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mesa encontrada',
    type: MesaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mesa não encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Mesa> {
    return this.mesasService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova mesa' })
  @ApiResponse({
    status: 201,
    description: 'Mesa criada com sucesso',
    type: MesaResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Mesa já existe' })
  async create(@Body() createMesaDto: CreateMesaDto): Promise<Mesa> {
    return this.mesasService.create(createMesaDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar mesa' })
  @ApiResponse({
    status: 200,
    description: 'Mesa atualizada com sucesso',
    type: MesaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mesa não encontrada' })
  @ApiResponse({ status: 409, description: 'Mesa com este número já existe' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ): Promise<Mesa> {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover mesa' })
  @ApiResponse({ status: 204, description: 'Mesa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Mesa não encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mesasService.remove(id);
  }
}

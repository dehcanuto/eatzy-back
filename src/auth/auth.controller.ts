import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { SelectRestauranteDto } from './dto/select-restaurante.dto';
import { RestauranteUsuarioDto } from './dto/restaurante-usuario.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user data' })
  @ApiResponse({
    status: 200,
    description: 'User data retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(
    @CurrentUser('userId') userId: number,
  ): Promise<UserResponseDto> {
    return this.authService.me(userId);
  }

  @Get('restaurantes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar restaurantes do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de restaurantes do usuário',
    type: [RestauranteUsuarioDto],
  })
  async getUserRestaurantes(
    @CurrentUser('userId') userId: number,
  ): Promise<RestauranteUsuarioDto[]> {
    return this.authService.getUserRestaurantes(userId);
  }

  @Post('selecionar-restaurante')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Selecionar restaurante para acesso' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante selecionado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado ao restaurante' })
  async selectRestaurante(
    @Body() selectDto: SelectRestauranteDto,
    @CurrentUser('userId') userId: number,
  ): Promise<LoginResponseDto> {
    return this.authService.selectRestaurante(userId, selectDto.restauranteId);
  }
}

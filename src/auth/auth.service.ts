import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserRestaurante } from '../entities/user-restaurante.entity';
import { Restaurante } from '../entities/restaurante.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { RestauranteUsuarioDto } from './dto/restaurante-usuario.dto';
import type { UserRole } from '../entities/user.entity';

interface JwtPayload {
  sub: number;
  email: string;
  restauranteId?: number;
  role?: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRestaurante)
    private userRestauranteRepository: Repository<UserRestaurante>,
    @InjectRepository(Restaurante)
    private restauranteRepository: Repository<Restaurante>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Buscar restaurantes do usuário
    const userRestaurantes = await this.userRestauranteRepository.find({
      where: { userId: user.id },
    });

    // Se não tem nenhum restaurante, retorna sem acesso a dados
    if (userRestaurantes.length === 0) {
      const payload: JwtPayload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: undefined as any,
        restauranteId: undefined,
        restaurantes: [],
        needsRestauranteSelection: false,
      };
    }

    // Busca dados dos restaurantes
    const restaurantes = await Promise.all(
      userRestaurantes.map(async (ur) => {
        const restaurante = await this.restauranteRepository.findOne({
          where: { id: ur.restauranteId },
        });
        return {
          id: ur.id,
          restauranteId: ur.restauranteId,
          restauranteNome: restaurante?.nome || '',
          role: ur.role,
        };
      }),
    );

    // Se tem apenas um restaurante, usa ele automaticamente
    if (restaurantes.length === 1) {
      const ur = userRestaurantes[0];
      const rest = restaurantes[0];
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        restauranteId: ur.restauranteId,
        role: ur.role,
      };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: ur.role,
        restauranteId: ur.restauranteId,
        restaurantes: [rest],
        needsRestauranteSelection: false,
      };
    }

    // Gera token temporário sem restaurante selecionado
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: undefined as any,
      restauranteId: undefined,
      restaurantes,
      needsRestauranteSelection: true,
    };
  }

  async selectRestaurante(
    userId: number,
    restauranteId: number,
  ): Promise<LoginResponseDto> {
    // Verifica se usuário tem acesso a este restaurante
    const userRestaurante = await this.userRestauranteRepository.findOne({
      where: { userId, restauranteId },
    });

    if (!userRestaurante) {
      throw new ForbiddenException('Usuário não tem acesso a este restaurante');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Busca todos os restaurantes do usuário
    const userRestaurantes = await this.userRestauranteRepository.find({
      where: { userId },
    });

    // Busca dados dos restaurantes
    const restaurantes = await Promise.all(
      userRestaurantes.map(async (ur) => {
        const restaurante = await this.restauranteRepository.findOne({
          where: { id: ur.restauranteId },
        });
        return {
          id: ur.id,
          restauranteId: ur.restauranteId,
          restauranteNome: restaurante?.nome || '',
          role: ur.role,
        };
      }),
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      restauranteId: userRestaurante.restauranteId,
      role: userRestaurante.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: userRestaurante.role,
      restauranteId: userRestaurante.restauranteId,
      restaurantes,
      needsRestauranteSelection: false,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.usersRepository.save(user);

    // Usuário novo não tem restaurante - precisa criar ou ser vinculado
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: undefined as any,
      restauranteId: undefined,
      restaurantes: [],
      needsRestauranteSelection: false,
    };
  }

  async me(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Busca restaurantes do usuário
    const userRestaurantes = await this.userRestauranteRepository.find({
      where: { userId },
    });

    // Busca dados dos restaurantes
    const restaurantes = await Promise.all(
      userRestaurantes.map(async (ur) => {
        const restaurante = await this.restauranteRepository.findOne({
          where: { id: ur.restauranteId },
        });
        return {
          id: ur.id,
          restauranteId: ur.restauranteId,
          restauranteNome: restaurante?.nome || '',
          role: ur.role,
        };
      }),
    );

    const { password, ...result } = user;
    return {
      ...result,
      restaurantes,
    } as UserResponseDto;
  }

  async getUserRestaurantes(userId: number): Promise<RestauranteUsuarioDto[]> {
    const userRestaurantes = await this.userRestauranteRepository.find({
      where: { userId },
    });

    return Promise.all(
      userRestaurantes.map(async (ur) => {
        const restaurante = await this.restauranteRepository.findOne({
          where: { id: ur.restauranteId },
        });
        return {
          id: ur.id,
          restauranteId: ur.restauranteId,
          restauranteNome: restaurante?.nome || '',
          role: ur.role,
        };
      }),
    );
  }

  async vincularUsuarioRestaurante(
    userId: number,
    restauranteId: number,
    role: UserRole,
  ): Promise<UserRestaurante> {
    // Verifica se restaurante existe
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
    });
    if (!restaurante) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    // Verifica se já existe vínculo
    const existing = await this.userRestauranteRepository.findOne({
      where: { userId, restauranteId },
    });
    if (existing) {
      throw new ConflictException('Usuário já vinculado a este restaurante');
    }

    const userRestaurante = this.userRestauranteRepository.create({
      userId,
      restauranteId,
      role,
    });

    return this.userRestauranteRepository.save(userRestaurante);
  }

  async desvincularUsuarioRestaurante(
    userId: number,
    restauranteId: number,
  ): Promise<void> {
    const userRestaurante = await this.userRestauranteRepository.findOne({
      where: { userId, restauranteId },
    });
    if (!userRestaurante) {
      throw new NotFoundException('Vínculo não encontrado');
    }

    await this.userRestauranteRepository.remove(userRestaurante);
  }
}

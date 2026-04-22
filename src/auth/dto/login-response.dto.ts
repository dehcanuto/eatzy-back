import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '../../entities/user.entity';
import { RestauranteUsuarioDto } from './restaurante-usuario.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'gerente', 'garcom', 'cozinha', 'financeiro'],
    required: false,
  })
  role?: UserRole;

  @ApiProperty({ example: 1, required: false })
  restauranteId?: number;

  @ApiProperty({ type: [RestauranteUsuarioDto], required: false })
  restaurantes?: RestauranteUsuarioDto[];

  @ApiProperty({
    example: false,
    description: 'Se true, usuário precisa selecionar um restaurante',
    required: false,
  })
  needsRestauranteSelection?: boolean;
}

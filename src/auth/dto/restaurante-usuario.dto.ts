import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '../../entities/user.entity';

export class RestauranteUsuarioDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  restauranteId: number;

  @ApiProperty()
  restauranteNome: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'gerente', 'garcom', 'cozinha', 'financeiro'],
  })
  role: UserRole;
}

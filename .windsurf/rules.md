---
description: Regras de arquitetura para o backend Eatzy (NestJS)
---

# Regras de Arquitetura - Backend

## Estrutura de Pastas
- Cada funcionalidade deve ter seu próprio módulo (ex: `auth/`, `users/`)
- DTOs ficam dentro de `src/[modulo]/dto/`
- Entidades ficam em `src/entities/`

## Padrões de Nomenclatura
- **Classes/DTOs/Entidades**: PascalCase (`LoginDto`, `UserResponseDto`, `User`)
- **Variáveis/métodos**: camelCase (`loginDto`, `findOne`, `isPasswordValid`)
- **Arquivos DTO**: `[nome].dto.ts` (ex: `login.dto.ts`)
- **Arquivos de entidade**: `[nome].entity.ts` (ex: `user.entity.ts`)
- **Tabelas no banco**: plural em snake_case (`users`, `order_items`)

## DTOs (Data Transfer Objects)
- Sempre usar `class-validator` para validação (`@IsEmail`, `@IsString`, `@IsNumber`)
- Sempre usar `@nestjs/swagger` com `@ApiProperty` para documentação
- Separar DTOs de request e response (ex: `LoginDto` e `LoginResponseDto`)
- Usar exemplos em `@ApiProperty({ example: '...' })`

## Entidades (TypeORM)
- Usar decorators apropriados:
  - `@PrimaryGeneratedColumn()` para IDs
  - `@Column()` para campos comuns
  - `@CreateDateColumn()` para `createdAt`
  - `@UpdateDateColumn()` para `updatedAt`
- Sempre incluir `createdAt` e `updatedAt` nas entidades
- Usar `{ unique: true }` para campos únicos

## Serviços
- Usar injeção de dependências via construtor
- Usar exceções do NestJS: `UnauthorizedException`, `ConflictException`, `NotFoundException`, `BadRequestException`
- Mensagens de erro em **português**
- Usar `bcrypt` para hash de senha
- Usar `JwtService` do `@nestjs/jwt` para autenticação

## Controllers
- Usar decorators do NestJS: `@Post()`, `@Get()`, `@Put()`, `@Delete()`, `@Body()`, `@Param()`
- Usar `@UseGuards(AuthGuard)` onde necessário
- Usar `@ApiTags()` do Swagger para agrupar endpoints

## Padrões Gerais
- Idioma: mensagens de usuário em português, código em inglês
- Sempre usar TypeScript com tipos explícitos
- Preferir `async/await` sobre Promises com `.then()`
- Nunca usar `any` - sempre definir interfaces ou tipos

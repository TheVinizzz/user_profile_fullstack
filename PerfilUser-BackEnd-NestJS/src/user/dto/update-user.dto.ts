import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, MinLength, MaxLength, IsUrl, Matches } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @IsOptional()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsOptional()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem deve ser válida' })
  profileImage?: string;

  // Campos de endereço profissionais
  @IsOptional()
  @MinLength(2, { message: 'Rua deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Rua deve ter no máximo 100 caracteres' })
  street?: string;

  @IsOptional()
  @MaxLength(10, { message: 'Número deve ter no máximo 10 caracteres' })
  number?: string;

  @IsOptional()
  @MaxLength(50, { message: 'Complemento deve ter no máximo 50 caracteres' })
  complement?: string;

  @IsOptional()
  @MinLength(2, { message: 'Bairro deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Bairro deve ter no máximo 50 caracteres' })
  neighborhood?: string;

  @IsOptional()
  @MinLength(2, { message: 'Cidade deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Cidade deve ter no máximo 50 caracteres' })
  city?: string;

  @IsOptional()
  @MinLength(2, { message: 'Estado deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Estado deve ter no máximo 50 caracteres' })
  state?: string;

  @IsOptional()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve estar no formato 00000-000' })
  zipCode?: string;

  @IsOptional()
  @MinLength(2, { message: 'País deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'País deve ter no máximo 50 caracteres' })
  country?: string;
} 
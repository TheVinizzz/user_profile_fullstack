import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUrl, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @MinLength(6, { message: 'Confirmação de senha deve ter pelo menos 6 caracteres' })
  confirmPassword: string;

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

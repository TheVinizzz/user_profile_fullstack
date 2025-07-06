import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Validar se as senhas são iguais
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new ConflictException('As senhas devem ser iguais');
    }

    const existingUser = await this.userService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

    const user = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      profileImage: registerDto.profileImage,
      street: registerDto.street,
      number: registerDto.number,
      complement: registerDto.complement,
      neighborhood: registerDto.neighborhood,
      city: registerDto.city,
      state: registerDto.state,
      zipCode: registerDto.zipCode,
      country: registerDto.country,
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Token de refresh é obrigatório');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de refresh inválido');
    }

    // Remove o token antigo
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    const payload: JwtPayload = { 
      sub: tokenRecord.user.id, 
      email: tokenRecord.user.email 
    };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(tokenRecord.user.id);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Token de refresh é obrigatório');
    }

    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '30d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }
} 
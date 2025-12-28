import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { users } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  /**
   * ID로 사용자 조회
   */
  async findById(id: string): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * ID로 사용자 조회 (인증용 - 필요한 필드만)
   */
  async findByIdForAuth(id: string): Promise<{ id: string; email: string; nickname: string }> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname || '',
    };
  }

  /**
   * 새 사용자 생성 (OAuth용 - password는 null)
   */
  async create(data: { email: string; nickname: string }): Promise<users> {
    return this.prisma.users.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        password: null,
      },
    });
  }

  /**
   * 사용자 조회 후 없으면 생성 (OAuth 로그인용)
   */
  async findOrCreate(email: string, nickname: string): Promise<users> {
    return this.prisma.users.upsert({
      where: { email },
      update: {},
      create: {
        email,
        nickname,
        password: null,
      },
    });
  }
}

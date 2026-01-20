import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { ModuleMetadata } from '@nestjs/common';
import type { Response } from 'express';
import type { users, rooms, room_members, RoomRole } from '../../src/generated/prisma/client.js';

/**
 * NestJS 테스트 모듈 생성 헬퍼
 */
export async function createTestingModule(metadata: ModuleMetadata): Promise<TestingModule> {
  return Test.createTestingModule(metadata).compile();
}

/**
 * Prisma Repository Mock 생성
 */
export function mockRepository() {
  return {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    deleteMany: jest.fn(),
    updateMany: jest.fn(),
    createMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findFirstOrThrow: jest.fn(),
  };
}

/**
 * JWT Service Mock
 */
export function mockJwtService() {
  return {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  };
}

/**
 * ConfigService Mock
 */
export function mockConfigService(config: Record<string, string | undefined> = {}) {
  return {
    get: jest.fn((key: string) => config[key]),
    getOrThrow: jest.fn((key: string) => {
      const value = config[key];
      if (value === undefined) {
        throw new Error(`Configuration key "${key}" does not exist`);
      }
      return value;
    }),
  };
}

/**
 * 테스트용 사용자 데이터 생성
 *
 * Prisma 스키마의 users 모델과 일치하는 mock 데이터를 생성합니다.
 * - id: cuid 형식
 * - email: 이메일 주소
 * - password: OAuth 사용자의 경우 null
 * - nickname: 사용자 닉네임
 * - created_at, updated_at: Date 객체
 */
export function createMockUser(overrides: Partial<users> = {}): users {
  const now = new Date();
  return {
    id: 'cltest123456789abcdef',
    email: 'test@example.com',
    password: null,
    nickname: 'TestUser',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

/**
 * 테스트용 Room 데이터 생성
 *
 * Prisma 스키마의 rooms 모델과 일치하는 mock 데이터를 생성합니다.
 */
export function createMockRoom(overrides: Partial<rooms> = {}): rooms {
  const now = new Date();
  return {
    id: 'clroom123456789abcdef',
    owner_user_id: 'cltest123456789abcdef',
    invite_link: 'test-invite-link-abc123',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

/**
 * 테스트용 RoomMember 데이터 생성
 *
 * Prisma 스키마의 room_members 모델과 일치하는 mock 데이터를 생성합니다.
 */
export function createMockRoomMember(overrides: Partial<room_members> = {}): room_members {
  const now = new Date();
  return {
    id: 'clmember123456789abcde',
    room_id: 'clroom123456789abcdef',
    user_id: 'cltest123456789abcdef',
    role: 'MEMBER' as RoomRole,
    joined_at: now,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

/**
 * Mock Request 객체 생성
 */
export function createMockRequest(
  overrides: Partial<{
    user: users;
    headers: Record<string, string>;
    body: unknown;
    query: Record<string, string>;
    params: Record<string, string>;
  }> = {}
) {
  return {
    user: createMockUser(),
    headers: {},
    body: {},
    query: {},
    params: {},
    ...overrides,
  };
}

/**
 * Mock Response 객체 생성
 */
export function createMockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

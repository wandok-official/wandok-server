import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { ModuleMetadata } from '@nestjs/common';
import type { Response } from 'express';

/**
 * NestJS 테스트 모듈 생성 헬퍼
 */
export async function createTestingModule(metadata: ModuleMetadata): Promise<TestingModule> {
  return Test.createTestingModule(metadata).compile();
}

/**
 * Prisma Repository Mock 생성
 */
export function mockRepository<T = any>() {
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
  } as T;
}

/**
 * JWT Service Mock
 */
export function mockJwtService() {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };
}

/**
 * 테스트용 사용자 데이터 생성
 */
export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    provider: 'google',
    providerId: 'google-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * 테스트용 Room 데이터 생성
 */
export function createMockRoom(overrides: Partial<any> = {}) {
  return {
    id: 'test-room-id',
    name: 'Test Room',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Mock Request 객체 생성
 */
export function createMockRequest(overrides: Partial<any> = {}) {
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
  };
  return res as unknown as Response;
}

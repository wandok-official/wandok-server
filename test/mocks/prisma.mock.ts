/**
 * Mock 모델 delegate 타입
 */
type MockModelDelegate = {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  upsert: jest.Mock;
  count: jest.Mock;
  aggregate: jest.Mock;
  groupBy: jest.Mock;
  deleteMany: jest.Mock;
  updateMany: jest.Mock;
  createMany: jest.Mock;
  findUniqueOrThrow: jest.Mock;
  findFirstOrThrow: jest.Mock;
};

/**
 * Mock PrismaService 타입
 *
 * 테스트에서 PrismaService를 대체할 때 사용하는 타입입니다.
 * 실제 PrismaService 대신 이 타입을 사용하면 mock shape 불일치를 컴파일 타임에 감지할 수 있습니다.
 */
export type MockPrismaService = {
  users: MockModelDelegate;
  documents: MockModelDelegate;
  anchors: MockModelDelegate;
  notes: MockModelDelegate;
  note_likes: MockModelDelegate;
  rooms: MockModelDelegate;
  room_members: MockModelDelegate;
  user_progress: MockModelDelegate;
  $connect: jest.Mock;
  $disconnect: jest.Mock;
  $transaction: jest.Mock;
  $executeRaw: jest.Mock;
  $queryRaw: jest.Mock;
};

/**
 * Prisma 모델 delegate의 기본 메서드 mock 생성
 */
function createModelMock(): MockModelDelegate {
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
 * Prisma Service Mock
 *
 * 테스트에서 PrismaService를 대체하는 mock 객체입니다.
 */
export const mockPrismaService: MockPrismaService = {
  users: createModelMock(),
  documents: createModelMock(),
  anchors: createModelMock(),
  notes: createModelMock(),
  note_likes: createModelMock(),
  rooms: createModelMock(),
  room_members: createModelMock(),
  user_progress: createModelMock(),

  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $transaction: jest
    .fn()
    .mockImplementation((callbackOrQueries: ((tx: MockPrismaService) => unknown) | unknown[]) => {
      if (typeof callbackOrQueries === 'function') {
        return callbackOrQueries(mockPrismaService);
      }
      return Promise.all(callbackOrQueries);
    }),
  $executeRaw: jest.fn().mockResolvedValue(0),
  $queryRaw: jest.fn().mockResolvedValue([]),
};

/**
 * 모든 Prisma mock 함수를 리셋합니다.
 *
 * mockReset() vs mockClear() 차이점:
 * - mockReset(): mock 구현(implementation)과 호출 기록을 모두 초기화합니다.
 *   테스트 간 완전한 격리가 필요할 때 사용합니다.
 * - mockClear(): 호출 기록만 초기화하고 mock 구현은 유지합니다.
 *   같은 mock 구현을 여러 테스트에서 재사용할 때 사용합니다.
 *
 * 여기서는 mockReset()을 사용하여 테스트 간 완전한 격리를 보장합니다.
 */
export function resetPrismaMocks(): void {
  const models = [
    mockPrismaService.users,
    mockPrismaService.documents,
    mockPrismaService.anchors,
    mockPrismaService.notes,
    mockPrismaService.note_likes,
    mockPrismaService.rooms,
    mockPrismaService.room_members,
    mockPrismaService.user_progress,
  ];

  models.forEach((model) => {
    Object.values(model).forEach((method) => {
      if (typeof method === 'function' && 'mockReset' in method) {
        method.mockReset();
      }
    });
  });

  mockPrismaService.$connect.mockReset().mockResolvedValue(undefined);
  mockPrismaService.$disconnect.mockReset().mockResolvedValue(undefined);
  mockPrismaService.$transaction
    .mockReset()
    .mockImplementation((callbackOrQueries: ((tx: MockPrismaService) => unknown) | unknown[]) => {
      if (typeof callbackOrQueries === 'function') {
        return callbackOrQueries(mockPrismaService);
      }
      return Promise.all(callbackOrQueries);
    });
  mockPrismaService.$executeRaw.mockReset().mockResolvedValue(0);
  mockPrismaService.$queryRaw.mockReset().mockResolvedValue([]);
}

// Mock environment variables
process.env.NODE_ENV = "test";

// Mock prisma client
const mockPrismaClient = {
  note: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  noteTag: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

// Mock the database module
jest.mock("../src/database", () => mockPrismaClient);

// mock test utils
global.mockPrisma = mockPrismaClient;

//Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// global data for test
export const testNote = {
  id: "test-note-id-123",
  userId: "test-user-id-123",
  title: "Test Note Title",
  content: "This is test note content",
  isDeleted: false,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  noteTags: [],
};

export const testCreateNoteRequest = {
  title: "New Test Note",
  content: "This is new test note content",
  tagIds: ["tag-id-1", "tag-id-2"],
};

export const testUpdateNoteRequest = {
  title: "Updated Test Note",
  content: "This is updated test note content",
};

// helper function to reset mocks before each test
export function resetAllMocks() {
  Object.values(mockPrismaClient.note).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
  Object.values(mockPrismaClient.noteTag).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
}

declare global {
  var mockPrisma: typeof mockPrismaClient;
}

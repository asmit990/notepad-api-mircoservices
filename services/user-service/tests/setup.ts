import axios from "axios";

// Mock environment variables
process.env.AUTH_SERVICE_URL = "http://localhost:3001";
process.env.NODE_ENV = "test";

// Mock prisma client
const mockPrismaClient = {
  userProfile: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

// Mock the database module
jest.mock("../src/database", () => mockPrismaClient);

// Mock axios for Authclient
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Global test utils
global.mockPrisma = mockPrismaClient;
global.mockAxios = mockedAxios;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// global data for test
export const testUserProfile = {
  id: "test-user-id-123",
  userId: "test-user-id",
  firstName: "Test",
  lastName: "User",
  bio: "This is a test user profile.",
  avatarUrl: "http://example.com/avatar.jpg",
  preferences: { theme: "dark", notifications: true },
  createdAt: new Date("2025-07-01T00:00:00Z"),
  updatedAt: new Date("2025-07-01T00:00:00Z"),
};

export const testUpdateProfileRequest = {
  firstName: "Updated",
  lastName: "User",
  bio: "This is an updated test user profile.",
  avatarUrl: "http://example.com/updated-avatar.jpg",
  preferences: { theme: "light", notifications: false },
};

export const testJwtPayload = {
  userId: "test-user-id",
  email: "test@example.com",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes from now
};

// helper function to reset mocks before each test
export function resetAllMocks() {
  Object.values(mockPrismaClient.userProfile).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
  mockedAxios.post.mockReset();
}

declare global {
  var mockPrisma: typeof mockPrismaClient;
  var mockAxios: jest.Mocked<typeof axios>;
}

import { UserService } from "../src/userService";

// Mock external dependencies
jest.mock("../src/authClient");

// Import mocked modules
import axios from "axios";
import { AuthClient } from "../src/authClient";
import { ServiceError } from "../../../shared/types";
import {
  resetAllMocks,
  testUpdateProfileRequest,
  testUserProfile,
} from "./setup";

const MockedAuthClient = AuthClient as jest.MockedClass<typeof AuthClient>;

// Helper function to test ServiceError
async function expectServiceError(
  asyncFn: () => Promise<any>,
  expectedMessage: string,
  expectedStatusCode: number
) {
  try {
    await asyncFn();
    fail("Expected function to throw ServiceError");
  } catch (error) {
    expect(error).toBeInstanceOf(ServiceError);
    expect(error.message).toBe(expectedMessage);
    expect(error.statusCode).toBe(expectedStatusCode);
  }
}

describe("UserService", () => {
  let userService: UserService;
  let mockAuthClient: jest.Mocked<AuthClient>;

  beforeAll(() => {
    resetAllMocks();

    // Create mock AuthClient instance
    mockAuthClient = {
      validateToken: jest.fn(),
    } as any;

    MockedAuthClient.mockImplementation(() => mockAuthClient);

    userService = new UserService();
  });

  describe("createProfile", () => {
    const userId = "test-user-id";
    const profileData = {
      firstName: "Test",
      lastName: "User",
      bio: "This is a test user profile.",
      avatarUrl: "http://example.com/avatar.jpg",
      preferences: { theme: "dark", notifications: true },
    };

    it("should create a user profile successfully", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      global.mockPrisma.userProfile.create.mockResolvedValue(testUserProfile);

      const result = await userService.createProfile(userId, profileData);
      expect(global.mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(global.mockPrisma.userProfile.create).toHaveBeenCalledWith({
        data: {
          userId,
          ...profileData,
        },
      });
      expect(result).toEqual(testUserProfile);
    });

    it("should throw an error if profile already exists", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(
        testUserProfile
      );

      await expectServiceError(
        () => userService.createProfile(userId, profileData),
        "User profile already exists",
        409
      );

      expect(global.mockPrisma.userProfile.create).not.toHaveBeenCalled();
    });

    it("should sanitize input data before creating profile", async () => {
      const unsanitizedData = {
        firstName: "<script>alert('xss')</script>Test",
        lastName: "User",
        bio: "This is a test user profile.",
        avatarUrl: "http://example.com/avatar.jpg",
        preferences: { theme: "dark", notifications: true },
      };

      global.mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      global.mockPrisma.userProfile.create.mockResolvedValue(testUserProfile);

      await userService.createProfile(userId, unsanitizedData);

      expect(global.mockPrisma.userProfile.create).toHaveBeenCalledWith({
        data: {
          userId,
          firstName: "scriptalert('xss')/scriptTest",
          lastName: "User",
          bio: "This is a test user profile.",
          avatarUrl: "http://example.com/avatar.jpg",
          preferences: { theme: "dark", notifications: true },
        },
      });
    });
  });

  describe("getProfile", () => {
    const userId = "test-user-id";

    it("should retrieve an existing user profile successfully", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(
        testUserProfile
      );

      const result = await userService.getProfile(userId);
      expect(global.mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(testUserProfile);
    });

    it("should throw an error if profile does not exist", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(null);

      await expectServiceError(
        () => userService.getProfile(userId),
        "User profile not found",
        404
      );
    });
  });

  describe("updateProfile", () => {
    const userId = "test-user-id";

    it("should update an existing user profile successfully", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(
        testUserProfile
      );
      global.mockPrisma.userProfile.update.mockResolvedValue({
        ...testUserProfile,
        ...testUpdateProfileRequest,
      });
    });

    it("should create a profile if it does not exist", async () => {
      global.mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      global.mockPrisma.userProfile.create.mockResolvedValue(testUserProfile);

      const result = await userService.updateProfile(
        userId,
        testUpdateProfileRequest
      );
      expect(global.mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(global.mockPrisma.userProfile.create).toHaveBeenCalledWith({
        data: {
          userId,
          ...testUpdateProfileRequest,
        },
      });
      expect(result).toEqual(testUserProfile);
    });
  });
});

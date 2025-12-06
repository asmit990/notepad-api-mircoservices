import { UpdateProfileRequest, UserProfile } from "../../../shared/types";
import { AuthClient } from "./authClient";
import prisma from "./database";
import { createServiceError, sanitizeInput } from "../../../shared/utils";

export class UserService {
  private authClient: AuthClient;

  constructor() {
    this.authClient = new AuthClient();
  }

  async createProfile(
    userId: string,
    profileData: Partial<UpdateProfileRequest>
  ): Promise<UserProfile> {
    // check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw createServiceError("User profile already exists", 409);
    }

    // sanitize input data
    const sanitizedData = this.sanitizeProfileData(profileData);

    // create new profile
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        ...sanitizedData,
      },
    });

    return profile;
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw createServiceError("User profile not found", 404);
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    profileData: Partial<UpdateProfileRequest>
  ): Promise<UserProfile> {
    // check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      // if no profile exists, create one
      return this.createProfile(userId, profileData);
    }

    // sanitize input data
    const sanitizedData = this.sanitizeProfileData(profileData);

    // update existing profile
    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: sanitizedData,
    });

    return updatedProfile;
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw createServiceError("User profile not found", 404);
    }

    await prisma.userProfile.delete({
      where: { userId },
    });
  }

  private sanitizeProfileData(
    data: Partial<UpdateProfileRequest>
  ): Partial<UpdateProfileRequest> {
    const sanitized: any = {};

    if (data.firstName !== undefined) {
      sanitized.firstName = data.firstName
        ? sanitizeInput(data.firstName)
        : null;
    }

    if (data.lastName !== undefined) {
      sanitized.lastName = data.lastName ? sanitizeInput(data.lastName) : null;
    }

    if (data.bio !== undefined) {
      sanitized.bio = data.bio ? sanitizeInput(data.bio) : null;
    }

    if (data.avatarUrl !== undefined) {
      sanitized.avatarUrl = data.avatarUrl
        ? sanitizeInput(data.avatarUrl)
        : null;
    }

    if (data.preferences !== undefined) {
      sanitized.preferences = data.preferences ? data.preferences : null;
    }

    return sanitized;
  }
}

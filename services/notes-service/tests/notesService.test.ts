import { ServiceError } from "../../../shared/types";
import { NotesService } from "../src/notesService";
import { resetAllMocks, testNote } from "./setup";

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

describe("NotesService", () => {
  let notesService: NotesService;

  beforeEach(() => {
    resetAllMocks();
    notesService = new NotesService();
  });

  describe("createNote", () => {
    const userId = "test-user-id-123";

    it("should successfully create a note without tags", async () => {
      global.mockPrisma.note.create.mockResolvedValue(testNote);

      const result = await notesService.createNote(userId, {
        title: "Test Note",
        content: "This is a test note",
      });

      expect(global.mockPrisma.note.create).toHaveBeenCalledWith({
        data: {
          userId,
          title: "Test Note",
          content: "This is a test note",
        },
        include: {
          noteTags: true,
        },
      });
      expect(result).toEqual(testNote);
    });
  });

  describe("getNoteById", () => {
    const noteId = "test-note-id-123";
    const userId = "test-user-id-123";

    it("should successfully retrieve a note", async () => {
      global.mockPrisma.note.findFirst.mockResolvedValue(testNote);

      const result = await notesService.getNoteById(noteId, userId);

      expect(global.mockPrisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: noteId,
          userId,
          isDeleted: false,
        },
        include: {
          noteTags: true,
        },
      });
      expect(result).toEqual(testNote);
    });
  });
});

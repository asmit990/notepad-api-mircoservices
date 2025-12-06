import { Router } from "express";
import * as noteController from "./noteController";
import { validateRequest, authenticateToken } from "../../../shared/middleware";
import { createNoteSchema, getNotesByUserSchema } from "./validation";

const router = Router();

//All routes require authentication
router.use(authenticateToken);

//Notes CRUD Operations
router.post("/", validateRequest(createNoteSchema), noteController.createNote);
router.get("/", validateRequest(getNotesByUserSchema), noteController.getNotes);
router.get("/:noteId", noteController.getNoteById);

export default router;

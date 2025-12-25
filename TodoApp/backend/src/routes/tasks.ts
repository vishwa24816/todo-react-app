import { Router } from "express";
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  createTaskValidation, 
  updateTaskValidation 
} from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Get all tasks for a user
router.get("/", getTasks);

// Create a new task
router.post("/", createTaskValidation, createTask);

// Update a task
router.put("/:id", updateTaskValidation, updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;

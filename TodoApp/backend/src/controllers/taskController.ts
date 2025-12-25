import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Task, { ITask } from "../models/Task";

// Get all tasks for a user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { filter, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { userId };
    
    if (filter === "completed") {
      query.status = "completed";
    } else if (filter === "pending") {
      query.status = "pending";
    }

    // Build sort
    const sort: any = {};
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      // Custom sort for priority
      const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * Number(page))
        .skip((Number(page) - 1) * Number(limit));
      
      // Sort by priority if requested
      if (sortBy === "priority") {
        tasks.sort((a, b) => {
          const comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          return sortOrder === "desc" ? -comparison : comparison;
        });
      }
      
      return res.json({
        tasks,
        currentPage: Number(page),
        totalPages: Math.ceil(await Task.countDocuments(query) / Number(limit))
      });
    }

    // Regular sort for other fields
    if (sortBy === "deadline" || sortBy === "createdAt") {
      sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort
    }

    const tasks = await Task.find(query)
      .sort(sort)
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const { title, description, deadline, priority, category } = req.body;

    const task = new Task({
      title,
      description,
      deadline: new Date(deadline),
      priority: priority || "medium",
      category,
      userId
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update deadline if provided
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    Object.assign(task, updates);
    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.deleteOne({ _id: id });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Validation rules
export const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title must be less than 100 characters"),
  body("deadline").isISO8601().withMessage("Please provide a valid deadline"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority")
];

export const updateTaskValidation = [
  body("title").optional().isLength({ max: 100 }).withMessage("Title must be less than 100 characters"),
  body("deadline").optional().isISO8601().withMessage("Please provide a valid deadline"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["pending", "completed"]).withMessage("Invalid status")
];

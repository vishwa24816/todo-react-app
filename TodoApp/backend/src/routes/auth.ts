import { Router } from "express";
import { register, login, registerValidation, loginValidation } from "../controllers/authController";

const router = Router();

// Register route
router.post("/register", registerValidation, register);

// Login route
router.post("/login", loginValidation, login);

export default router;

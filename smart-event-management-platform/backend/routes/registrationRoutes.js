import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyRegistrations } from "../controllers/registrationController.js";

const router = express.Router();

router.get("/my", authMiddleware, getMyRegistrations);

export default router;

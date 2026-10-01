import express from "express";
import {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStatistics
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { getEventRegistrations, registerForEvent } from "../controllers/registrationController.js";

const router = express.Router();

router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);
router.get("/stats", authMiddleware, adminMiddleware, getEventStatistics);
router.get("/:id/registrations", authMiddleware, adminMiddleware, getEventRegistrations);
router.post("/:id/register", authMiddleware, registerForEvent);
router.get("/:id", getEventById);
router.get("/", getAllEvents);
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

export default router;

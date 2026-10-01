import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

const isCompleted = (date) => {
  const now = new Date();
  const eventDate = new Date(date);
  return eventDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (isCompleted(event.date)) {
      return res.status(400).json({ message: "Event is completed" });
    }

    const existing = await Registration.findOne({ user: req.user.id, event: id });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    const registeredCount = await Registration.countDocuments({ event: id });
    if (registeredCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: id
    });

    res.status(201).json({ message: "Event registration successful", registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event")
      .sort({ registeredAt: -1 });

    const result = registrations
      .filter((registration) => registration.event)
      .map((registration) => ({
        id: registration._id,
        registeredAt: registration.registeredAt,
        event: registration.event
      }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrations = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const registrations = await Registration.find({ event: req.params.id })
      .populate("user", "name email")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

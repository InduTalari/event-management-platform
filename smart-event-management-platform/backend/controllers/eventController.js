import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

const todayStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const buildSearch = (search) => {
  if (!search) return {};
  return {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } }
    ]
  };
};

const withAvailability = async (events) => {
  const result = [];
  for (const event of events) {
    const registered = await Registration.countDocuments({ event: event._id });
    result.push({
      ...event.toObject(),
      registeredCount: registered,
      availableSeats: Math.max(event.capacity - registered, 0),
      status: new Date(event.date) >= todayStart() ? "Upcoming" : "Completed"
    });
  }
  return result;
};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find(buildSearch(req.query.search))
      .sort({ date: 1 })
      .populate("createdBy", "name email");
    res.json(await withAvailability(events));
  } catch (error) {
    next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      date: { $gte: todayStart() },
      ...buildSearch(req.query.search)
    }).sort({ date: 1 });
    res.json(await withAvailability(events));
  } catch (error) {
    next(error);
  }
};

export const getPastEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      date: { $lt: todayStart() },
      ...buildSearch(req.query.search)
    }).sort({ date: -1 });
    res.json(await withAvailability(events));
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const data = (await withAvailability([event]))[0];
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, location, category, capacity, image } = req.body;

    if (!title || !description || !date || !time || !location || !category || !capacity) {
      return res.status(400).json({ message: "All required event fields must be provided" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      capacity: Number(capacity),
      image: image || "",
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const fields = ["title", "description", "date", "time", "location", "category", "capacity", "image"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = field === "capacity" ? Number(req.body[field]) : req.body[field];
    });

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getEventStatistics = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ date: { $gte: todayStart() } });
    const completedEvents = await Event.countDocuments({ date: { $lt: todayStart() } });
    const totalRegistrations = await Registration.countDocuments();

    const upcoming = await Event.find({ date: { $gte: todayStart() } })
      .sort({ date: 1 })
      .limit(5);
    const upcomingWithCounts = await withAvailability(upcoming);

    res.json({ totalEvents, upcomingEvents, completedEvents, totalRegistrations, upcoming: upcomingWithCounts });
  } catch (error) {
    next(error);
  }
};

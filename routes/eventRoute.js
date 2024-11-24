//eventRoute.js
const express = require("express");
const router = express.Router();
const { AddEvent, getEventsforAsso, deleteEvent, editEvent, getEvent, joinEvent } = require("../controllers/eventController");

router.post("/events/addEvent", AddEvent);
router.use("/events/getEventsforAsso", getEventsforAsso);
router.delete("/events/deleteEvent/:id", deleteEvent);
router.post("/events/editEvent", editEvent)
router.get("/events/:id", getEvent);
router.post("/events/joinEvent", joinEvent);

module.exports = router;
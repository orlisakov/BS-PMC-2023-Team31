//volunteerRoute.js
const express = require("express");
const router = express.Router();
const { removeFromWishlist, getWishlist, addToWishlist, getProfile, signupVolunteer, getVolunteerById, deleteAssociation, deleteEvent, updateProfile } = require("../controllers/volunteerController");

router.post("/signup/volunteer", signupVolunteer);
router.get("/volunteer/Profile/:id", getVolunteerById);
router.put("/volunteers/deleteAssociations/:id", deleteAssociation);
router.delete("/volunteers/deleteEvent/:volunteerId/:eventId", deleteEvent);
router.put("/volunteer/updateProfile/:id", updateProfile);
router.get("/volunteer/getProfile/:id", getProfile);
router.post("/volunteer/addToWishlist/:volunteerId/:associationId", addToWishlist);
router.get("/volunteer/wishlist/:id", getWishlist);
router.delete("/volunteer/removeFromWishlist/:volunteerId/:associationId", removeFromWishlist);

module.exports = router;
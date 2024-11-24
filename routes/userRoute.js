const express = require("express");
const router = express.Router();
const { loginUser, deleteAssociationTest, deleteEventsTest, deleteVolunteerTest } = require("../controllers/userController");

router.post("/login", loginUser);
router.delete("/deleteAssociationTest", deleteAssociationTest);
router.delete("/deleteEventesTest", deleteEventsTest);
router.delete("/deleteVolunteerTest", deleteVolunteerTest);

module.exports = router;
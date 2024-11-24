const express = require("express");
const router = express.Router();
const { getAllUsers, getRecentUsers, sendMessage } = require("../controllers/adminController");

router.get("/getUsersData", getAllUsers);
router.get("/getRecentUsers", getRecentUsers);
router.post('/sendMessage', sendMessage);

module.exports = router;
//associationRoute.js
const express = require("express");
const router = express.Router();
const { deleteAssociation, getProfile, updateProfile ,deleteVolunteer, getAssociationsData, signupAssociation, getAssociationById, joinAssociation, getAssociation, approveVolunteer, rejectVolunteer, addCommentToAssociation , getAssociationComments } = require("../controllers/associationControllers");


router.post("/signup/association", signupAssociation);
router.get("/associationsData", getAssociationsData);
router.get("/associations/Profile/:id", getAssociationById); 
router.get("/associations/associationMangePage/:id", getAssociation);
router.put("/associations/join/:id", joinAssociation);
router.put("/associations/approveVolunteer/:id", approveVolunteer);
router.put("/associations/rejectVolunteer/:id", rejectVolunteer);
router.post("/associations/addComment/:id", addCommentToAssociation);
router.get('/associations/comments/:id', getAssociationComments);
router.put("/associations/deleteVolunteer/:id", deleteVolunteer);
router.put("/associations/updateProfile/:id", updateProfile);
router.get("/associations/getProfile/:id", getProfile );


module.exports = router;
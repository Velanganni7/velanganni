 const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, getSongsByUserPreference } = require('../Controller/userController');
 const {Router} = express
 const router = Router()


router.post("/createUser",createUser);
router.get("/all", getAllUsers);
router.get("/single/:id", getUserById);
router.post("/updateUser/:id", updateUser);
router.post("/deleteUser/:id", deleteUser);
router.post("/login", loginUser);
router.get("/getPerference/:id", getSongsByUserPreference);


 module.exports = router

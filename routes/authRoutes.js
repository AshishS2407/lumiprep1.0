const express = require('express');
const router = express.Router();
const { signup, login, userLogin, createUser, getAllUsers } = require('./controllers/authController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/signup', signup);
router.post('/login', login);
router.post("/user-login", userLogin)
router.post('/create-user', auth,isAdmin,createUser)
router.get('/users', auth,isAdmin, getAllUsers);

module.exports = router;

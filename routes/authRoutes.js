const express = require('express');
const router = express.Router();
const { signup, login, userLogin, createUser, getAllUsers, createAdmin, getOnlyUsers, getAdminMentorSuperadminUsers } = require('./controllers/authController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/signup', signup);
router.post('/login', login);
router.post("/user-login", userLogin)
router.post('/create-user', auth,isAdmin,createUser)
router.get('/users', auth,isAdmin, getAllUsers);
router.get('/usersonly', auth,isAdmin, getOnlyUsers);
router.get('/admins', auth,isAdmin, getAdminMentorSuperadminUsers);
router.post('/create-admin', auth,isAdmin, createAdmin);


module.exports = router;

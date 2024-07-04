const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const router = new express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/user/me', auth, userController.updateUser);
router.delete('/user/me', auth, userController.deleteUser);
router.get('/users', userController.searchUser);
router.post('/user/follow/:id', auth, userController.followUser);

module.exports = router;

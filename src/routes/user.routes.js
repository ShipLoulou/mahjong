const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.post('/one', userController.getUser);
router.get('/', userController.userConnected);
router.put('/', auth, userController.editSocket);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/registration', userController.registration);
router.put('/score', userController.editScore);

module.exports = router;
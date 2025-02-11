const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const invitationController = require('../controllers/invitation.controller');

router.post('/', invitationController.getEnnemyInvitations);
router.post('/create', invitationController.createInvitation);
router.put('/response', invitationController.editResponse);
router.delete('/delete', invitationController.deleteInvitation);

module.exports = router;
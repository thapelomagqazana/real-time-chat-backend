const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, messageController.sendMessage);
router.get('/chatroom/:chatRoomId', authMiddleware, messageController.getChatRoomMessages);
router.patch("/delete/:messageId", authMiddleware, messageController.deleteMessage);

module.exports = router;
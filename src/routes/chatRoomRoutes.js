const express = require('express');
const chatRoomController = require('../controllers/chatRoomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, chatRoomController.createChatRoom);
router.post("/join/:chatRoomId", authMiddleware, chatRoomController.joinChatRoom);

module.exports = router;
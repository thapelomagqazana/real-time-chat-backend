const express = require('express');
const chatRoomController = require('../controllers/chatRoomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, chatRoomController.createChatRoom);
router.post("/join/:chatRoomId", authMiddleware, chatRoomController.joinChatRoom);
router.post("/exit/:chatRoomId", authMiddleware, chatRoomController.exitChatRoom);

module.exports = router;
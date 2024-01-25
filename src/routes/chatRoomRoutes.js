const express = require('express');
const chatRoomController = require('../controllers/chatRoomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, chatRoomController.createChatRoom);

module.exports = router;
const Message = require('../models/Message');
const uploadService = require('../services/uploadService');

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatRoomId } = req.body;
    const senderId = req.userId;

    // Handle multimedia upload if present
    let multimedia = null;
    if (req.file) {
      multimedia = await uploadService.uploadMultimedia(req.file);
    }

    const message = new Message({
      content,
      sender: senderId,
      chatRoom: chatRoomId,
      multimedia,
    });

    await message.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getChatRoomMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate('sender', 'username') // Populate sender details
      .sort({ createdAt: 'asc' }); // Sort messages by creation time

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error getting chat room messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
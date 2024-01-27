const Message = require('../models/Message');
const ChatRoom = require("../models/ChatRoom");
const uploadService = require('../services/uploadService');

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatRoomId } = req.body;
    const senderId = req.user.id;

    if (req.user.banned !== false)
    {
        return res.status(403).json({ error: "Unauthorized - Insufficient privileges" });
    }

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

exports.deleteMessage = async (req, res) => {
  try
  {
      const { messageId } = req.params;

      // Access user information, including the role, from the req.user object
      const { id: adminId, role } = req.user;

      const message = await Message.findById(messageId);

      if (!message)
      {
          return res.status(404).json({ error: "Message not found" });
      }

      const chatRoom = await ChatRoom.findById(message.chatRoom);

      // Check if the user has the necessary role to delete a message
      if (chatRoom.admins.includes(adminId) || role === 'admin')
      {
        // Delete the message (update the message's deleted status in the database)
        await Message.findByIdAndUpdate(messageId, { deleted: true });

        res.status(200).json({ message: "Message deleted successfully" });
      }
      else
      {
        return res.status(403).json({ error: "Unauthorized - Insufficient privileges" });
      }
  }
  catch (error)
  {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    deleted: {
      type: Boolean, 
      default: false,
    },
    multimedia: {
        type: String,
        default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;
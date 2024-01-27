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
    // Add an index for the content field to enable text search
    // This index is specifically for the search functionality
    // Ensure that your MongoDB server has text search enabled
    // Example: db.messages.createIndex({ content: 'text' })
    textIndex: {
      type: String,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  // Create a text index on the textIndex field
  messageSchema.index({ textIndex: 'text' });
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;
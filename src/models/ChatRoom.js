const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
const ChatRoom = require("../models/ChatRoom");

exports.createChatRoom = async (req, res) => {
    try
    {
        const { name } = req.body;
        const createdBy = req.userId;

        const newChatRoom = new ChatRoom({
            name,
            createdBy,
        });

        await newChatRoom.save();

        res.status(201).json({ message: "Chat room created successfully" });
    }
    catch (error)
    {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
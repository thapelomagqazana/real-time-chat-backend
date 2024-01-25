const ChatRoom = require("../models/ChatRoom");

exports.createChatRoom = async (req, res) => {
    try
    {
        const { name } = req.body;
        const createdBy = req.userId;

        const chatroom = new ChatRoom({
            name,
            createdBy,
            members: [createdBy], // Add the creator as a member
        });

        await chatroom.save();

        res.status(201).json({ message: "Chat room successfully created" });
    }
    catch (error)
    {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.joinChatRoom = async (req, res) => {
    try
    {
        const { chatRoomId } = req.params;
        const userId = req.userId;

        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom)
        {
            return res.status(404).json({ error: "Chat room not found" });
        }

        // Check if the user is already a member
        if (chatRoom.members.includes(userId))
        {
            return res.status(400).json({ error: "User is already a member of this chat room" });
        }

        chatRoom.members.push(userId);
        await chatRoom.save();

        res.status(200).json({ message: "User joined the chat room successfully" });
    }
    catch (error)
    {
        console.error("Error joining chat rooms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.exitChatRoom = async (req, res) => {
    try
    {
        const { chatRoomId } = req.params;
        const userId = req.userId;

        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom)
        {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        // Check if the user is a member of the chat room
        if (!chatRoom.members.includes(userId))
        {
            return res.status(400).json({ error: 'User is not a member of this chat room' });
        }

        // Remove the user from the chat room's members
        chatRoom.members = chatRoom.members.filter(memberId => memberId.toString() !== userId);

        await chatRoom.save();
        res.status(200).json({ message: 'User exited the chat room successfully' });
    }
    catch (error)
    {
        console.error('Error exiting chat room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
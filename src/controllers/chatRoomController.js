const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const Message = require("../models/Message");

exports.createChatRoom = async (req, res) => {
    try
    {
        const { name, tags } = req.body;
        const createdBy = req.user.id;

        const chatroom = new ChatRoom({
            name,
            createdBy,
            members: [createdBy], // Add the creator as a member
            admins: [createdBy],
            tags,
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
        const userId = req.user.id;

        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom)
        {
            return res.status(404).json({ error: "Chat room not found" });
        }

        if (req.user.banned !== false)
        {
            return res.status(403).json({ error: "Unauthorized - Insufficient privileges" });
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
        const userId = req.user.id;

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

exports.findChatRoomsByTag = async (req, res) => {
    try
    {
        const { tag } = req.params;

        const chatRooms = await ChatRoom.find({ tags: tag });

        res.status(200).json({ chatRooms });
    }
    catch (error)
    {
        console.error('Error finding chat rooms by tag:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.banUser = async (req, res) => {
    try
    {
        const { chatRoomId, userId } = req.params;

        // Access user information, including the role, from the req.user object
        const { id: adminId, role } = req.user

        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom)
        {
            return res.status(404).json({ error: "Chat room not found" });
        }

        // Check if the user being banned is a member of the chat room
        if (!chatRoom.members.includes(userId))
        {
            return res.status(404).json({ error: "User not found in the chat room" });
        }

        // Check if the user has the necessary role to ban a user
        if (chatRoom.admins.includes(adminId) || role === "admin")
        {
            // Ban the user (update the user's banned status in the database)
            await User.findByIdAndUpdate(userId, { banned: true });

            res.status(200).json({ message: "User banned successfully" });
        }
        else
        {
            return res.status(403).json({ error: "Unauthorized - Insufficient privileges" });
        }

        
    }
    catch (error)
    {
        console.error("Error banning user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
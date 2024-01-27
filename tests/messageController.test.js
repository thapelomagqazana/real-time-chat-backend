const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Message = require('../src/models/Message');
const User = require('../src/models/User');
const ChatRoom = require('../src/models/ChatRoom');
const { generateToken } = require("../src/services/authService");

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-real-time-chat', { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await Message.deleteMany();
  await User.deleteMany();
  await ChatRoom.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Message Sending and Retrieval', () => {
  it('should send a message in a chat room', async () => {

    const user = mockUser("testuser", "testpassword");
    await user.save();

    const userId = user._id;

    const chatroom = mockChatRoom('Test Chat Room', userId, [userId], ['general', 'programming']);

    await chatroom.save();
 
    const chatRoomId = chatroom._id;

    const userToken = generateToken(user);

    // Send a message in the chat room
    const response = await request(app)
      .post('/message/send')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        content: 'Hello, this is a test message!',
        chatRoomId,
        multimedia: 'pexels-mikhail-nilov-6969739.jpg',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toHaveProperty('content', 'Hello, this is a test message!');
      expect(response.body.message).toHaveProperty('chatRoom');
      expect(response.body.message).toHaveProperty('multimedia');
      
      // Retrieve messages in the chat room
      const getMessagesResponse = await request(app)
        .get(`/message/chatroom/${chatRoomId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(getMessagesResponse.statusCode).toBe(200);
      expect(getMessagesResponse.body.messages).toHaveLength(1);
      expect(getMessagesResponse.body.messages[0]).toHaveProperty('content', 'Hello, this is a test message!');
      expect(getMessagesResponse.body.messages[0]).toHaveProperty('chatRoom', chatRoomId.toString());
      expect(getMessagesResponse.body.messages[0].chatRoom.toString()).toEqual(chatRoomId.toString());
  });

});

// Function to mock User
function mockUser(username, password) {
    const user = new User({
      username: username,
      password: password,
    });
  
    return user;
  }
  
  // Function to mock ChatRoom
  function mockChatRoom(name, createdBy, members, tags){
    const chatroom = new ChatRoom({
      name: name,
      createdBy: createdBy,
      members: members,
      tags: tags
    });
    return chatroom;
  }
  
  
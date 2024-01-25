const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const ChatRoom = require('../src/models/ChatRoom');
const User = require('../src/models/User');
const { generateToken } = require("../src/services/authService");

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-real-time-chat', { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await ChatRoom.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Chat Room Creation and Joining', () => {
  it('should create a new chat room', async () => {
    // Assuming you have a user registered (authentication is done)
    const user = new User({
      username: 'testuser',
      password: 'testpassword',
    });
    await user.save();

    // Generate a valid token for the user
    const token = generateToken(user);

    const response = await request(app)
      .post('/chatroom/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Chat Room',
      });

    // Change the expected status code to 401 if the request should be unauthorized
    expect(response.statusCode).toBe(201);
    expect(response.body.chatroom).toBeDefined();
  });

  it("should join an existing chat room", async () => {
    const user = new User({
        username: 'testuser',
        password: 'testpassword',
      });
      await user.save();
  
      // Generate a valid token for the user
      const token = generateToken(user);
  
      const createRoomResponse = await request(app)
        .post('/chatroom/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Chat Room',
        });

      const chatRoomId = createRoomResponse.body.chatroom._id;

      const user1 = new User({
        username: 'testuser1',
        password: 'testpassword1',
      });
      await user1.save();

      const token1 = generateToken(user1);

      const joinRoomResponse = await request(app)
      .post(`/chatroom/join/${chatRoomId}`)
      .set('Authorization', `Bearer ${token1}`);

      expect(joinRoomResponse.statusCode).toBe(200);
      expect(joinRoomResponse.body.message).toBe('User joined the chat room successfully');

  });
});
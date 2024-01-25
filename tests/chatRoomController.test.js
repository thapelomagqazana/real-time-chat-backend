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
    const user = mockUser("testuser", "testpassword");
    await user.save();

    // Generate a valid token for the user
    const token = generateToken(user);

    const response = await request(app)
      .post('/chatroom/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Chat Room',
        tags: ['general', 'programming'],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Chat room successfully created");
  });

  it('should create a chat room with tags', async () => {
    const user = mockUser("testuser1", "testpassword1");
    await user.save();

    const userId = user._id;

    const chatroom = mockChatRoom('Test Chat Room', userId, [userId], ['general', 'programming']);

    await chatroom.save();
    expect(chatroom).toHaveProperty('tags', ['general', 'programming']);
  });


  it("should join an existing chat room", async () => {
    const user = mockUser("testuser", "testpassword");
      await user.save();

      const userId = user._id;

      const chatroom = mockChatRoom('Test Chat Room', userId, [userId], ['general', 'programming']);

      await chatroom.save();
  
      
      const chatRoomId = chatroom._id;

      const user1 = mockUser("testuser1", "testpassword1");
      await user1.save();

      const token1 = generateToken(user1);

      const joinRoomResponse = await request(app)
      .post(`/chatroom/join/${chatRoomId}`)
      .set('Authorization', `Bearer ${token1}`);

      expect(joinRoomResponse.statusCode).toBe(200);
      expect(joinRoomResponse.body.message).toBe('User joined the chat room successfully');

  });

  it("shouldn't allow user to join if user exists in the chat room", async () => {
    const user = mockUser("testuser", "testpassword");
      await user.save();

      const userId = user._id;

      const chatroom = mockChatRoom('Test Chat Room', userId, [userId], ['general', 'programming']);

      await chatroom.save();
  
      const chatRoomId = chatroom._id;

      const token = generateToken(user);

      const joinRoomResponse = await request(app)
      .post(`/chatroom/join/${chatRoomId}`)
      .set('Authorization', `Bearer ${token}`);

      expect(joinRoomResponse.statusCode).toBe(400);
      expect(joinRoomResponse.body.error).toBe("User is already a member of this chat room");

  });
});


describe('Chat Room Exit', () => {
  it('should exit an existing chat room', async () => {
    const user = mockUser("testuser", "testpassword");
    await user.save();

    const userId = user._id;

    const chatroom = mockChatRoom('Test Chat Room', userId, [userId], ['general', 'programming']);

    await chatroom.save();

    const chatRoomId = chatroom._id;

    const token = generateToken(user);

    const exitRoomResponse = await request(app)
      .post(`/chatroom/exit/${chatRoomId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(exitRoomResponse.statusCode).toBe(200);
    expect(exitRoomResponse.body.message).toBe('User exited the chat room successfully');
  });
});

describe('Chat Room Categorization', () => {
  it('should find chat rooms by tag', async () => {
    const user = mockUser("testuser", "testpassword");
    await user.save();

    const userId = user._id;

    // Create two chat rooms with different tags
    const chatroom = mockChatRoom('General Chat', userId, [userId], ['general']);
    await chatroom.save();

    const chatroom1 = mockChatRoom('Programming Chat', userId, [userId], ['programming']);
    await chatroom1.save();

    const token = generateToken(user);

    // Find chat rooms with the 'general' tag
    const findRoomsResponse = await request(app)
      .get('/chatroom/tags/general')
      .set('Authorization', `Bearer ${token}`);

    expect(findRoomsResponse.statusCode).toBe(200);
    expect(findRoomsResponse.body.chatRooms).toHaveLength(1);
    expect(findRoomsResponse.body.chatRooms[0].tags).toContain('general');
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


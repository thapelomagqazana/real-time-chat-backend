const request = require('supertest');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { generateToken } = require("../src/services/authService");

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test-real-time-chat', { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Registration', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should not register a user with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'us', // Invalid username length
        password: 'short', // Invalid password length
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe('User Login', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const newUser = new User({
      username: 'testuser',
      password: hashedPassword,
    });
    await newUser.save();
  });

  it('should login a registered user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});

describe('User Account Update', () => {
  
  it('should update user account with new username', async () => {

    const newUser = new User({
      username: 'testuser',
      password: 'testpassword',
    });
    await newUser.save();
    const userToken = generateToken(newUser);

    const response = await request(app)
      .put('/user/update')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        username: 'newUsername',
        password: "newPassword",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated successfully');

    const updatedUser = await User.findById(newUser._id);
    expect(updatedUser.username).toBe('newUsername');
  });
});

describe('User Roles', () => {
  it('should assign a role to a user', async () => {
    const regularUser = await User.create({
      username: 'regularUser',
      password: 'password',
    });

    await regularUser.save();

    const regularUserToken = generateToken(regularUser);

    const adminUser = await User.create({
      username: 'adminUser',
      password: 'password',
      role: 'admin',
    });

    await adminUser.save();

    const adminUserToken = generateToken(adminUser);

    const responseRegularUser = await request(app)
      .patch('/user/assign-role')
      .set('Authorization', `Bearer ${regularUserToken}`)
      .send({
        userId: regularUser._id,
        role: 'admin',
      });

    const responseAdminUser = await request(app)
      .patch('/user/assign-role')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        userId: adminUser._id,
        role: 'user',
      });

    expect(responseRegularUser.statusCode).toBe(200);
    expect(responseRegularUser.body.message).toBe('Role assigned successfully');
    expect(responseRegularUser.body.user.role).toBe('admin');

    expect(responseAdminUser.statusCode).toBe(200);
    expect(responseAdminUser.body.message).toBe('Role assigned successfully');
    expect(responseAdminUser.body.user.role).toBe('user');
  });
});


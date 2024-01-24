const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { mongoURI } = require("../src/config/config");

// Establish a connection before running any tests
beforeAll(async () => {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database and reset data after each test
beforeEach(async () => {
  await User.deleteMany();
});

// Close the connection after all tests
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('User Registration and Login', () => {
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

  it('should login a registered user', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
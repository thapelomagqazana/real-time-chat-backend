const dotenv = require('dotenv');
const config = require('../src/config/config');

describe('Configuration Tests', () => {
  beforeAll(() => {
    // Load environment variables from a .env file (if present)
    dotenv.config();
  });

  it('should have a valid secretKey', () => {
    expect(config.secretKey).toBeDefined();
    expect(typeof config.secretKey).toBe('string');
  });

  it('should have a valid mongoURI', () => {
    expect(config.mongoURI).toBeDefined();
    expect(typeof config.mongoURI).toBe('string');
  });
});
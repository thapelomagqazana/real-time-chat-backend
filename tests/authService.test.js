const jwt = require("jsonwebtoken");
const { generateToken } = require("../src/services/authService");
const { secretKey } = require("../src/config/config");

describe("generateToken Function", () => {
  // Mock user data for testing
  const mockUser = {
    _id: "mockUserId",
    username: "mockUsername",
  };

  it("should generate a valid JWT token", () => {
    const token = generateToken(mockUser);

    // Verify if the token is a string
    expect(typeof token).toBe("string");

    // Verify if the token can be decoded successfully
    const decodedToken = jwt.verify(token, secretKey);
    expect(decodedToken.userId).toBe(mockUser._id);
  });

  it("should include the correct claims in the JWT token", () => {
    const token = generateToken(mockUser);

    // Verify if the decoded token contains the correct user ID
    const decodedToken = jwt.verify(token, secretKey);
    expect(decodedToken.userId).toBe(mockUser._id);

    // You can add more assertions based on the claims you include in the token
    // For example, expect(decodedToken.username).toBe(mockUser.username);
  });

  it("should have an expiration time of 1 hour", () => {
    const token = generateToken(mockUser);

    // Verify if the token has an expiration time
    const decodedToken = jwt.verify(token, secretKey, { ignoreExpiration: true });
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check if the expiration time is within an acceptable range (1 hour)
    expect(decodedToken.exp).toBeGreaterThan(currentTimestamp);
    expect(decodedToken.exp).toBeLessThanOrEqual(currentTimestamp + 3600);
  });
});

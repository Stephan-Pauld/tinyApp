const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

// I CHANGED MY HELPER FUNCTION TO FOLLOW ALONG WITH COMPASS..... But Im not using my helper function in this way... So ive changed it backs


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });

  it('should fail looking for a user', function() {
    const user = getUserByEmail(testUsers, "123@345.com")
    const expectedOutput = "dshbdbb";
    assert.isNull(user, expectedOutput);
  });
});
const auth = require('./auth');
const { createAccessToken } = require('../utils/tokens');

const req = {};
const res = {};
const next = jest.fn();

req.header = jest.fn();

describe('Auth middleware', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 if access token was not sent', async () => {
    auth(req, res, next);

    expect(next.mock.calls[0][0].status).toBe(401);
  });

  it('should return 401 if access token was sent but invalid', async () => {
    req.header = jest.fn(() => 'Bearer 123');

    auth(req, res, next);

    expect(next.mock.calls[0][0].status).toBe(401);
  });

  it('auth middleware should succeed', async () => {
    const token = createAccessToken();

    req.header = jest.fn(() => `Bearer ${token}`);

    auth(req, res, next);

    expect(next.mock.calls[0][0]).not.toBeDefined();
  });
});

import { POST } from '../route';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

const mockFindOne = jest.fn();

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: Promise.resolve({
    db: () => ({
      collection: () => ({
        findOne: mockFindOne,
      }),
    }),
  }),
}));

describe('POST /login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if email or password missing', async () => {
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: '' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('Email and password are required');
  });

  it('returns 401 if user not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toBe(401);
    expect(data.message).toBe('Invalid email or password');
  });

  it('returns 401 if password does not match', async () => {
    mockFindOne.mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpass' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashedpassword');
    expect(res.status).toBe(401);
    expect(data.message).toBe('Invalid email or password');
  });

  it('returns 200 and user info on successful login', async () => {
    const fakeUser = { _id: 'userId123', email: 'test@example.com', password: 'hashedpassword' };
    mockFindOne.mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'correctpass' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(bcrypt.compare).toHaveBeenCalledWith('correctpass', 'hashedpassword');
    expect(res.status).toBe(200);
    expect(data.message).toBe('Login successful');
    expect(data.user).toEqual({
      id: fakeUser._id,
      email: fakeUser.email,
    });
  });
});

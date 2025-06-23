// route.test.ts
import { GET, PUT } from '../route';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: Promise.resolve({
    db: () => ({
      collection: () => ({
        findOne: jest.fn().mockImplementation(({ _id }) => {
          if (_id.toString() === '000000000000000000000001') {
            return Promise.resolve({
              _id,
              name: 'Test User',
              email: 'test@example.com',
              password: 'hashedpassword',
              age: 25,
              updatedAt: new Date(),
            });
          }
          return Promise.resolve(null);
        }),
        updateOne: jest.fn().mockImplementation(({ _id }) => {
          if (_id.toString() === '000000000000000000000001') {
            return Promise.resolve({ matchedCount: 1 });
          }
          return Promise.resolve({ matchedCount: 0 });
        }),
      }),
    }),
  }),
}));

describe('GET /api/profile/[userId]', () => {
  it('returns user data without password', async () => {
    const response = await GET(
      new Request('http://localhost'),
      { params: { userId: '000000000000000000000001' } }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.email).toBe('test@example.com');
    expect(body.password).toBeUndefined();
  });

  it('returns 404 if user not found', async () => {
    const response = await GET(
      new Request('http://localhost'),
      { params: { userId: '000000000000000000000002' } }
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe('User not found');
  });
});

describe('PUT /api/profile/[userId]', () => {
  it('updates user and returns success message', async () => {
    const reqBody = { age: 30 };
    const response = await PUT(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: { userId: '000000000000000000000001' } }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Profile updated successfully');
  });

  it('returns 400 if age is invalid', async () => {
    const reqBody = { age: -5 };
    const response = await PUT(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: { userId: '000000000000000000000001' } }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('Age must be a positive number');
  });

  it('returns 404 if user not found', async () => {
    const reqBody = { age: 40 };
    const response = await PUT(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: { userId: '000000000000000000000002' } }
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe('User not found');
  });
});

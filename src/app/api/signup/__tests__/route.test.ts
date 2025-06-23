// app/api/signup/__tests__/route.test.ts
import { POST } from '../route';

describe('POST /api/signup', () => {
  it('returns 400 when required fields are missing', async () => {
    const mockRequest = {
      json: async () => ({ name: '', email: '', password: '' }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('All fields are required');
  });

  it('returns 400 for invalid password', async () => {
    const mockRequest = {
      json: async () => ({
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Password must be at least 8 characters long');
  });
});

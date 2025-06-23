// src/app/api/health/[userId]/__tests__/route.test.ts

import { GET, POST, DELETE } from '../route';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';

jest.mock('@/lib/mongodb', () => {
  const updateOneMock = jest.fn().mockResolvedValue({ acknowledged: true });
  const deleteOneMock = jest.fn().mockResolvedValue({ deletedCount: 1 });
  const findOneMock = jest.fn().mockResolvedValue({
    bloodType: 'O+',
    bloodPressure: '120/80',
    cholesterol: {
      total: 190,
      hdl: 55,
      ldl: 110,
    },
    hasAllergies: false,
    hasConditions: false,
    updatedAt: new Date(),
  });

  return {
    __esModule: true,
    default: Promise.resolve({
      db: () => ({
        collection: () => ({
          updateOne: updateOneMock,
          deleteOne: deleteOneMock,
          findOne: findOneMock,
        }),
      }),
    }),
  };
});

const mockUserId = new ObjectId().toString();

const createRequest = (method: string, body?: object): NextRequest =>
  new Request(`http://localhost/api/health/${mockUserId}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
  }) as unknown as NextRequest;

describe('Health Profile API', () => {
  it('GET /health-profile/:userId should return health profile data if found', async () => {
    const res = await GET(createRequest('GET'), { params: { userId: mockUserId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(
      expect.objectContaining({
        bloodType: 'O+',
        bloodPressure: '120/80',
      })
    );
  });

  it('POST /health-profile/:userId should save a new health profile', async () => {
    const body = {
      bloodType: 'O+',
      bloodPressure: '120/80',
      cholesterol: { total: 190, hdl: 55, ldl: 110 },
      hasAllergies: false,
      hasConditions: false,
    };

    const res = await POST(createRequest('POST', body), { params: { userId: mockUserId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Health profile saved successfully');
  });

  it('DELETE /health-profile/:userId should delete a health profile if found', async () => {
    const res = await DELETE(createRequest('DELETE'), { params: { userId: mockUserId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Health profile deleted successfully');
  });

  it('DELETE /health-profile/:userId should return 404 if nothing was deleted', async () => {
    // override mock to simulate not found
    const client = await (await import('@/lib/mongodb')).default;
    client.db().collection().deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

    const res = await DELETE(createRequest('DELETE'), { params: { userId: mockUserId } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Health profile not found');
  });
});

// route.test.ts
import { GET, POST } from '../route';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: Promise.resolve({
    db: () => ({
      collection: (name: string) => {
        if (name === 'users') {
          return {
            findOne: jest.fn().mockImplementation(({ _id }) => {
              if (_id.toString() === '000000000000000000000001') {
                return Promise.resolve({
                  _id,
                  medications: [new ObjectId('111111111111111111111111')],
                });
              }
              return Promise.resolve(null);
            }),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
          };
        }

        if (name === 'medications') {
          return {
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([
                {
                  _id: new ObjectId('111111111111111111111111'),
                  medicationName: 'Paracetamol',
                  dosage: '500mg',
                },
              ]),
            }),
            insertOne: jest.fn().mockResolvedValue({
              insertedId: new ObjectId('222222222222222222222222'),
            }),
          };
        }

        return {};
      },
    }),
  }),
}));

describe('GET /api/medication/[userId]', () => {
  it('returns medications for valid user', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: { userId: '000000000000000000000001' },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.medications).toHaveLength(1);
    expect(data.medications[0].medicationName).toBe('Paracetamol');
  });

  it('returns 404 for non-existent user', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: { userId: '000000000000000000000002' },
    });

    const data = await response.json();
    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.message).toBe('User not found');
  });
});

describe('POST /api/medication/[userId]', () => {
  it('adds a medication and links to user', async () => {
    const body = {
      medicationName: 'Ibuprofen',
      startDate: '2023-01-01',
      endDate: '2023-01-10',
      dosage: '200mg',
      frequency: 'Twice daily',
    };

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: { userId: '000000000000000000000001' },
      }
    );

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.medicationId).toBeDefined();
  });

  it('returns 400 if userId is missing', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: { userId: '' as any }, // simulate missing userId
      }
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Invalid userId');
  });
});

import { DELETE } from '../route';  // Adjust import path if needed
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

// Mock your db client and collections if needed
// Here, assume clientPromise is already mocked or using a test db.

describe('DELETE /api/medication/delete/[medicationId]', () => {
  // Mock NextRequest with nextUrl and searchParams
  function createMockRequest(userId?: string): NextRequest {
    const queryString = userId ? `userId=${userId}` : '';
    return {
      nextUrl: {
        searchParams: new URLSearchParams(queryString),
      },
    } as unknown as NextRequest;
  }

  it('successfully deletes a medication and updates the user', async () => {
    // Use valid userId and medicationId strings (24 hex chars for ObjectId)
    const userId = '64a7cde7a1f123456789abcd';
    const medicationId = '64a7cde7a1f123456789abce';

    const req = createMockRequest(userId);

    const response = await DELETE(req, { params: { medicationId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 400 when userId or medicationId is missing', async () => {
    // Missing userId and medicationId
    const req = createMockRequest(); // no userId
    const response = await DELETE(req, { params: { medicationId: '' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Missing userId or medicationId');
  });

  it('handles server error gracefully', async () => {
    // Forcing an error: pass invalid ObjectId to cause error in your route
    const req = createMockRequest('invalidUserId');
    const medicationId = 'invalidMedicationId';

    const response = await DELETE(req, { params: { medicationId } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Server error');
  });
});

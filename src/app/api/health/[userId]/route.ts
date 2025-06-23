import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Type definitions
interface HealthProfile {
  _id?: ObjectId;
  userId: ObjectId;
  bloodType?: string;
  bloodPressure?: string;
  cholesterol?: {
    total?: number;
    hdl?: number;
    ldl?: number;
  };
  hasAllergies?: boolean;
  allergies?: string[];
  hasConditions?: boolean;
  conditions?: string[];
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Fetch Health Profile
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<ApiResponse<Omit<HealthProfile, '_id' | 'userId'>>>> {
  const { userId } = params;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const healthProfile = await db
      .collection<HealthProfile>('healthProfiles')
      .findOne({ userId: new ObjectId(userId) });

    if (!healthProfile) {
      return NextResponse.json(
        { success: false, message: 'Health profile not found' },
        { status: 404 }
      );
    }

    // Remove MongoDB-specific fields from response
    const { _id, userId: _, ...profileData } = healthProfile;

    return NextResponse.json({ 
      success: true, 
      data: profileData 
    });
  } catch (error) {
    
  }
}

// Post new health profile
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<ApiResponse<void>>> {
  const { userId } = params;

  if (!ObjectId.isValid(userId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid userId format' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const formData: Omit<HealthProfile, '_id' | 'userId' | 'updatedAt'> = await req.json();

    const updateResult = await db
      .collection<HealthProfile>('healthProfiles')
      .updateOne(
        { userId: new ObjectId(userId) },
        {
          $set: {
            ...formData,
            userId: new ObjectId(userId),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

    if (!updateResult.acknowledged) {
      throw new Error('Update operation failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Health profile saved successfully',
    });
  } catch (err) {
    console.error('POST health profile error:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: err instanceof Error ? err.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Delete health profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<ApiResponse<void>>> {
  const { userId } = params;

  if (!ObjectId.isValid(userId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid userId format' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const deleteResult = await db
      .collection<HealthProfile>('healthProfiles')
      .deleteOne({ userId: new ObjectId(userId) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Health profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Health profile deleted successfully',
    });
  } catch (err) {
    console.error('DELETE health profile error:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: err instanceof Error ? err.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
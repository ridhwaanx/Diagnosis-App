import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Convert string ID to MongoDB ObjectId
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(params.userId) 
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data before returning
    const { password, ...userData } = user;
    
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const updates = await request.json();

    // Validate updates
    if (updates.age && (isNaN(updates.age) || updates.age < 0)) {
      return NextResponse.json(
        { message: 'Age must be a positive number' },
        { status: 400 }
      );
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
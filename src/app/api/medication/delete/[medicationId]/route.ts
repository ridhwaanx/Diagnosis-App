import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest, { params }: { params: { medicationId: string } }) {
  const { medicationId } = params;
  const userId = req.nextUrl.searchParams.get('userId');

  // Check for user ID and medication ID
  if (!userId || !medicationId) {
    return NextResponse.json({ success: false, message: 'Missing userId or medicationId' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Remove from user's medications array
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { medications: new ObjectId(medicationId) } }
    );

    // Delete medication from the medications collection
    await db.collection('medications').deleteOne({ _id: new ObjectId(medicationId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

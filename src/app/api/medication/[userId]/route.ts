import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch all medications for a user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  // Validate userId
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Find user and their medication IDs
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const medicationIds = user.medications || [];

    // Get all medications for user
    const medications = await db
      .collection('medications')
      .find({ _id: { $in: medicationIds } })
      .toArray();

    return NextResponse.json({ success: true, medications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Add new medication for a user
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const colors = ['#A40000', '#0032A4', '#A4A100', '#02A400', '#7600A4', '#D17A00', '#D100C9'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Validate userId
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Invalid userId' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const {
      medicationName,
      startDate,
      endDate,
      dosage,
      frequency,
      color,
    } = await req.json();

    const newMedication = {
      medicationName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dosage,
      frequency,
      color: color || randomColor,
    };

    const result = await db.collection('medications').insertOne(newMedication);

    // Link the medication to the user
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { medications: result.insertedId } }
    );

    return NextResponse.json({ success: true, medicationId: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

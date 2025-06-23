import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { email, password } = await request.json();
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return success
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
  
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

// Password validation function
function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (/\s/.test(password)) {
    return { valid: false, message: 'Password cannot contain whitespace' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password cannot contain special characters' };
  }
  
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { name, email, password } = await request.json();
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { message: passwordValidation.message },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Hash password with bcrypt (12 rounds)
    const hashedPassword = await hash(password, 12);
    
    // Insert new user with hashed password
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      age: '',
      height: '',
      weight: '',
      ethnicity: '',
      sex: '',
      medications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create structured, empty health profile after user creation
    await db.collection('healthProfiles').insertOne({
      userId: result.insertedId,
      allergies: [],
      hasAllergies: false,
      conditions: [],
      hasConditions: false,
      bloodPressure: '',
      bloodType: '',
      cholesterol: {},
      updatedAt: new Date()
    });
    
    
    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
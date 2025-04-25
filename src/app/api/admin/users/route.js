import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    // This should have middleware to protect admin routes
    // For now, we'll just return the data for demo purposes
    
    // Get all users (excluding password field)
    const users = await User.find({}, { password: 0 }).lean();
    
    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Create a new user
export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    
    // Create new user
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password, // Should be hashed in a real application
      isAdmin: data.isAdmin || false,
    });
    
    // Remove password from user object before sending response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    };
    
    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
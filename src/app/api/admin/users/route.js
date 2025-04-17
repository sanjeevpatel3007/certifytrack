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
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ 
        message: 'User ID is required',
        success: false 
      }, { status: 400 });
    }
    
    const user = await User.findById(id).select('-password -resetToken -resetTokenExpiry');
    
    if (!user) {
      return NextResponse.json({ 
        message: 'User not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      user,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch user',
      success: false 
    }, { status: 500 });
  }
} 
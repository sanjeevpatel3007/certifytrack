import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Check if the user is authenticated via cookies/headers
    const { cookies, headers } = request;
    const authHeader = headers.get('authorization');
    
    // Get user email from request context - you might need to adjust this based on how you store the user info
    const userEmail = headers.get('x-user-email'); // Customize based on your auth headers
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    
    // Fetch the user to check if they're an admin
    const user = await User.findOne({ email: userEmail }).select('-password');
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    if (!user.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } 
    });
    
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    
    // Check if the user is authenticated via cookies/headers
    const { cookies, headers } = request;
    const authHeader = headers.get('authorization');
    
    // Get user email from request context - you might need to adjust this based on how you store the user info
    const userEmail = headers.get('x-user-email'); // Customize based on your auth headers
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    
    // Fetch the user to check if they're an admin
    const existingUser = await User.findOne({ email: userEmail }).select('-password');
    
    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    if (!existingUser.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    // Get the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }
    
    // Update user data
    existingUser.name = data.name;
    
    // Only update email if it's different and not already in use by another user
    if (data.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: data.email });
      if (emailExists) {
        return NextResponse.json({ success: false, message: 'Email is already in use' }, { status: 400 });
      }
      existingUser.email = data.email;
    }
    
    await existingUser.save();
    
    // Return updated user data
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      } 
    });
    
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 
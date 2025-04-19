import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    const userId = searchParams.get('userId');
    
    // Build query based on provided filters
    const query = {};
    if (batchId) query.batchId = batchId;
    if (userId) query.userId = userId;
    
    // Find enrollments matching the query with population
    const enrollments = await Enrollment.find(query)
      .populate('userId', 'name email')
      .populate('batchId', 'title startDate endDate')
      .sort({ enrolledAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      enrollments 
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
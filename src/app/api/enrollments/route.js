import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Batch from '@/models/Batch';

// Get enrollments for a user
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    // Find enrollments for this user and populate with batch details
    const enrollments = await Enrollment.find({ userId })
      .populate({
        path: 'batchId',
        select: 'title courseName startDate bannerImage instructor durationDays'
      })
      .sort({ enrolledDate: -1 })
      .lean();
    
    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ message: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// Create a new enrollment
export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.userId || !data.batchId) {
      return NextResponse.json({ 
        message: 'User ID and Batch ID are required' 
      }, { status: 400 });
    }
    
    // Check if the batch exists and is active
    const batch = await Batch.findById(data.batchId);
    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }
    
    if (!batch.isActive) {
      return NextResponse.json({ 
        message: 'This batch is not currently accepting enrollments' 
      }, { status: 400 });
    }
    
    // Check if the user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: data.userId,
      batchId: data.batchId
    });
    
    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'You are already enrolled in this batch',
        enrollment: existingEnrollment
      }, { status: 409 }); // Conflict
    }
    
    // Create new enrollment
    const newEnrollment = await Enrollment.create({
      userId: data.userId,
      batchId: data.batchId,
      enrolledDate: new Date(),
      status: 'active',
      progress: 0,
      completedTasks: []
    });
    
    return NextResponse.json({ 
      message: 'Successfully enrolled in the batch',
      enrollment: newEnrollment
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ message: 'Failed to enroll in batch' }, { status: 500 });
  }
} 
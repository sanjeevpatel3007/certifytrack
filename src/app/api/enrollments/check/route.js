import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';

export async function GET(request) {
  console.log("[API] Enrollment check requested");
  
  try {
    await dbConnect();
    console.log("[API] Database connected");
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const batchId = searchParams.get('batchId');
    
    console.log("[API] Enrollment check params:", { userId, batchId });
    
    if (!userId || !batchId) {
      console.log("[API] Enrollment check - missing parameters");
      return NextResponse.json({ 
        message: 'User ID and Batch ID are required',
        isEnrolled: false,
        enrollment: null
      }, { status: 400 });
    }
    
    // Check if user is enrolled in the batch
    console.log(`[API] Querying enrollment with userId:${userId}, batchId:${batchId}`);
    
    const enrollment = await Enrollment.findOne({
      userId,
      batchId
    }).lean();
    
    console.log("[API] Enrollment result:", enrollment ? {
      found: true,
      enrollmentId: enrollment._id,
      completedTasks: enrollment.completedTasks?.length || 0
    } : "Not found");
    
    return NextResponse.json({ 
      isEnrolled: !!enrollment,
      enrollment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error checking enrollment:', error);
    return NextResponse.json({ 
      message: 'Failed to check enrollment status',
      error: error.message,
      stack: error.stack,
      isEnrolled: false,
      enrollment: null
    }, { status: 500 });
  }
} 
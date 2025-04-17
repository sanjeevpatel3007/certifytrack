import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Task from '@/models/Task';

export async function GET(request) {
  console.log("[API] User progress requested");
  
  try {
    await dbConnect();
    console.log("[API] Database connected for progress check");
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const batchId = searchParams.get('batchId');
    
    console.log("[API] Progress check params:", { userId, batchId });
    
    if (!userId || !batchId) {
      console.log("[API] Progress check - missing parameters");
      return NextResponse.json({ 
        message: 'User ID and Batch ID are required',
        completedTasks: [],
        progress: 0
      }, { status: 400 });
    }
    
    // Get the enrollment record
    console.log(`[API] Finding enrollment for userId:${userId}, batchId:${batchId}`);
    const enrollment = await Enrollment.findOne({
      userId,
      batchId
    }).lean();
    
    if (!enrollment) {
      console.log(`[API] No enrollment found for userId:${userId}, batchId:${batchId}`);
      return NextResponse.json({ 
        message: 'User is not enrolled in this batch',
        completedTasks: [],
        progress: 0
      }, { status: 404 });
    }
    
    console.log(`[API] Enrollment found: ${enrollment._id}`);
    
    // Get all tasks for this batch
    console.log(`[API] Finding tasks for batchId:${batchId}`);
    const allTasks = await Task.find({ batchId }).lean();
    console.log(`[API] Found ${allTasks.length} tasks for batch`);
    
    // Get completed tasks
    const completedTasks = enrollment.completedTasks || [];
    console.log(`[API] User has completed ${completedTasks.length} tasks`);
    
    // Calculate progress percentage
    const progress = allTasks.length > 0 
      ? Math.round((completedTasks.length / allTasks.length) * 100) 
      : 0;
    
    // Get the last completed task
    let lastCompletedTaskId = null;
    if (completedTasks.length > 0) {
      // Find the most recently completed task
      console.log(`[API] Finding last completed task from ${completedTasks.length} completed tasks`);
      const lastTask = await Task.findOne({
        _id: { $in: completedTasks },
        batchId
      }).sort({ dayNumber: -1, order: -1 }).lean();
      
      if (lastTask) {
        lastCompletedTaskId = lastTask._id;
        console.log(`[API] Last completed task: ${lastTask.title} (Day ${lastTask.dayNumber})`);
      }
    }
    
    return NextResponse.json({
      enrollment,
      completedTasks,
      progress,
      lastCompletedTaskId,
      totalTasks: allTasks.length
    });
  } catch (error) {
    console.error('[API] Error getting user progress:', error);
    return NextResponse.json({ 
      message: 'Failed to get user progress',
      error: error.message,
      stack: error.stack,
      completedTasks: [],
      progress: 0
    }, { status: 500 });
  }
} 
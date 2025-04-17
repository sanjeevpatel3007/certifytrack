import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Enrollment from '@/models/Enrollment';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Properly unwrap params
    const unwrappedParams = await params;
    const taskId = unwrappedParams.id;
    
    const { userId } = await request.json();
    
    if (!taskId || !userId) {
      return NextResponse.json({ 
        message: 'Task ID and User ID are required',
        success: false
      }, { status: 400 });
    }
    
    // Make sure the task exists
    const task = await Task.findById(taskId).lean();
    if (!task) {
      return NextResponse.json({ 
        message: 'Task not found',
        success: false
      }, { status: 404 });
    }
    
    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      batchId: task.batchId
    });
    
    if (!enrollment) {
      return NextResponse.json({ 
        message: 'User is not enrolled in this course',
        success: false
      }, { status: 403 });
    }
    
    // Remove task from completed tasks if it's in the list
    enrollment.completedTasks = enrollment.completedTasks.filter(
      completedTaskId => completedTaskId.toString() !== taskId
    );
    
    await enrollment.save();
    
    // Recalculate progress
    const allTasks = await Task.find({ batchId: task.batchId }).lean();
    const progress = Math.round((enrollment.completedTasks.length / allTasks.length) * 100);
    
    return NextResponse.json({ 
      message: 'Task marked as incomplete',
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error marking task as incomplete:', error);
    return NextResponse.json({ 
      message: 'Failed to mark task as incomplete',
      success: false
    }, { status: 500 });
  }
} 
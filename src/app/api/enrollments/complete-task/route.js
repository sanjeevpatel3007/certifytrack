import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Task from '@/models/Task';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'enrollmentId', 'taskId'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          message: `${field} is required` 
        }, { status: 400 });
      }
    }
    
    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      _id: data.enrollmentId,
      userId: data.userId
    });
    
    if (!enrollment) {
      return NextResponse.json({ 
        message: 'Enrollment not found' 
      }, { status: 404 });
    }
    
    // Check if the task exists
    const task = await Task.findById(data.taskId);
    
    if (!task) {
      return NextResponse.json({ 
        message: 'Task not found' 
      }, { status: 404 });
    }
    
    // Check if the task is already completed
    if (enrollment.completedTasks.includes(data.taskId)) {
      return NextResponse.json({ 
        message: 'Task already marked as completed',
        isCompleted: true
      });
    }
    
    // Add the task to completedTasks
    enrollment.completedTasks.push(data.taskId);
    
    // Calculate new progress percentage
    const totalTasks = await Task.countDocuments({ batchId: task.batchId });
    enrollment.progress = Math.round((enrollment.completedTasks.length / totalTasks) * 100);
    
    // Update lastActiveDate
    enrollment.lastActiveDate = new Date();
    
    // If progress is 100%, mark as completed
    if (enrollment.progress >= 100) {
      enrollment.status = 'completed';
    }
    
    // Save the changes
    await enrollment.save();
    
    return NextResponse.json({
      message: 'Task marked as completed',
      progress: enrollment.progress,
      isCompleted: true
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ 
      message: 'Failed to mark task as completed' 
    }, { status: 500 });
  }
} 
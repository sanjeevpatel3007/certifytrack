import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskSubmission from '@/models/TaskSubmission';
import Task from '@/models/Task';
import Enrollment from '@/models/Enrollment';

// Get submissions (with filtering)
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const taskId = searchParams.get('taskId');
    const batchId = searchParams.get('batchId');
    const status = searchParams.get('status');
    
    // Build query based on provided filters
    const query = {};
    if (userId) query.userId = userId;
    if (taskId) query.taskId = taskId;
    if (batchId) query.batchId = batchId;
    if (status) query.status = status;
    
    // Find submissions matching the query
    const submissions = await TaskSubmission.find(query)
      .populate('userId', 'name email')
      .populate('taskId', 'title contentType dayNumber')
      .sort({ submittedAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      submissions 
    });
  } catch (error) {
    console.error('Error fetching task submissions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Create new submission
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { taskId, userId, batchId, content, files, links } = body;
    
    // Validation
    if (!taskId || !userId || !batchId) {
      return NextResponse.json({ 
        success: false, 
        error: 'TaskId, userId, and batchId are required' 
      }, { status: 400 });
    }
    
    // Check if the task exists
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task not found' 
      }, { status: 404 });
    }
    
    // Check if user is enrolled in the batch
    const enrollment = await Enrollment.findOne({ userId, batchId });
    if (!enrollment) {
      return NextResponse.json({ 
        success: false, 
        error: 'You are not enrolled in this course' 
      }, { status: 403 });
    }
    
    // Check if a submission already exists
    let submission = await TaskSubmission.findOne({ taskId, userId });
    
    if (submission) {
      // If submission exists, update it and add to history
      const version = (submission.history?.length || 0) + 1;
      
      // Add current version to history
      submission.history.push({
        version,
        content: submission.content,
        files: submission.files,
        links: submission.links,
        submittedAt: new Date()
      });
      
      // Update with new content
      submission.content = content || '';
      submission.files = files || [];
      submission.links = links || [];
      submission.submittedAt = new Date();
      submission.status = 'pending'; // Reset to pending on resubmission
      
      await submission.save();
    } else {
      // Create new submission
      submission = await TaskSubmission.create({
        taskId,
        userId,
        batchId,
        content: content || '',
        files: files || [],
        links: links || [],
        submittedAt: new Date(),
        history: []
      });
    }
    
    // Update the task completion in enrollment
    if (!enrollment.completedTasks.includes(taskId)) {
      enrollment.completedTasks.push(taskId);
      
      // Recalculate progress
      const totalTasks = await Task.countDocuments({ batchId });
      enrollment.progress = Math.round((enrollment.completedTasks.length / totalTasks) * 100);
      
      await enrollment.save();
    }
    
    return NextResponse.json({ 
      success: true, 
      submission 
    });
  } catch (error) {
    console.error('Error creating task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskSubmission from '@/models/TaskSubmission';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const batchId = searchParams.get('batchId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    // Build query based on provided filters
    const query = {};
    if (taskId) query.taskId = taskId;
    if (batchId) query.batchId = batchId;
    if (userId) query.userId = userId;
    if (status) query.status = status;
    
    // Find submissions matching the query with population
    const submissions = await TaskSubmission.find(query)
      .populate('userId', 'name email')
      .populate('taskId', 'title contentType dayNumber')
      .sort({ submittedAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      submissions 
    });
  } catch (error) {
    console.error('Error fetching admin submissions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
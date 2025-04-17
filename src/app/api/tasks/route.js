import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// Get tasks, optionally filtered by batchId and published status
export async function GET(request) {
  try {
    await dbConnect();
    console.log('Tasks API endpoint called');
    
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    const publishedOnly = searchParams.get('publishedOnly') !== 'false';
    
    // Build query
    const query = batchId ? { batchId } : {};
    
    // For public access, only return published tasks
    if (publishedOnly) {
      query.isPublished = true;
    }
    
    console.log('Fetching tasks with query:', JSON.stringify(query));
    
    // Fetch tasks with all fields
    const tasks = await Task.find(query)
      .sort({ dayNumber: 1, order: 1 })
      .populate('batchId', 'title courseName')
      .lean();
    
    console.log(`Found ${tasks.length} tasks, first task fields:`, 
      tasks.length > 0 ? Object.keys(tasks[0]) : 'No tasks found');
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
} 
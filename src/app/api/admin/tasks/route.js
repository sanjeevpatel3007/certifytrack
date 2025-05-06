import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Batch from '@/models/Batch';

// Get all tasks or filter by batchId
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    
    // Build query
    const query = batchId ? { batchId } : {};
    
    // Execute query with population of batch details
    const tasks = await Task.find(query)
      .sort({ batchId: 1, dayNumber: 1 })
      .populate('batchId', 'title courseName durationDays')
      .lean();
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// Create a new task
export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'dayNumber', 'batchId', 'contents'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          message: `${field} is required` 
        }, { status: 400 });
      }
    }

    // Validate contents array
    if (!Array.isArray(data.contents) || data.contents.length === 0) {
      return NextResponse.json({ 
        message: 'At least one content type is required' 
      }, { status: 400 });
    }

    // Validate each content type
    for (const content of data.contents) {
      if (!content.type) {
        return NextResponse.json({ 
          message: 'Content type is required for each content' 
        }, { status: 400 });
      }

      // Validate required fields based on content type
      switch (content.type) {
        case 'video':
          if (!content.videoUrl) {
            return NextResponse.json({ 
              message: 'Video URL is required for video content' 
            }, { status: 400 });
          }
          break;
        case 'assignment':
          if (!content.assignment) {
            return NextResponse.json({ 
              message: 'Assignment details are required for assignment content' 
            }, { status: 400 });
          }
          break;
        case 'reading':
          if (!content.readingContent) {
            return NextResponse.json({ 
              message: 'Reading content is required for reading content' 
            }, { status: 400 });
          }
          break;
        case 'project':
          if (!content.projectDetails) {
            return NextResponse.json({ 
              message: 'Project details are required for project content' 
            }, { status: 400 });
          }
          break;
      }
    }
    
    // Validate that the batch exists
    const batch = await Batch.findById(data.batchId);
    if (!batch) {
      return NextResponse.json({ 
        message: 'Batch not found'
      }, { status: 404 });
    }
    
    // Validate day number is within batch duration
    if (data.dayNumber < 1 || data.dayNumber > batch.durationDays) {
      return NextResponse.json({ 
        message: `Day number must be between 1 and ${batch.durationDays}`
      }, { status: 400 });
    }
    
    // Check if a task already exists for this day in this batch
    const existingTask = await Task.findOne({
      batchId: data.batchId,
      dayNumber: data.dayNumber
    });
    
    if (existingTask) {
      return NextResponse.json({ 
        message: `A task for day ${data.dayNumber} already exists in this batch`
      }, { status: 409 }); // Conflict
    }
    
    try {
      // Create new task
      const newTask = await Task.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return NextResponse.json({ 
        message: 'Task created successfully',
        task: newTask
      });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ 
        message: validationError.message || 'Task validation failed',
        errors: validationError.errors
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
} 
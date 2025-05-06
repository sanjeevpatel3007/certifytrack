import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskSubmission from '@/models/TaskSubmission';
import Task from '@/models/Task';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';

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
    
    console.log('Received submission data:', { 
      taskId, 
      userId, 
      batchId, 
      contentLength: content?.length || 0,
      files: files ? `Files array with ${files.length} items` : 'No files',
      links: links ? `Links array with ${links.length} items` : 'No links'
    });
    
    // Debug log for files format
    if (files && files.length > 0) {
      console.log('First file structure:', JSON.stringify(files[0], null, 2));
    }
    
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
    
    // Validate files array format if provided
    let validatedFiles = [];
    if (files && Array.isArray(files)) {
      validatedFiles = files.filter(file => {
        // Check if file has necessary properties
        return file && typeof file === 'object' && file.url && typeof file.url === 'string';
      }).map(file => ({
        url: file.url || '',
        name: file.name || 'Unnamed file',
        type: file.type || 'unknown',
        size: file.size ? Number(file.size) : 0,
        publicId: file.publicId || ''
      }));
    }
    
    // Validate links array format if provided
    let validatedLinks = [];
    if (links && Array.isArray(links)) {
      validatedLinks = links.filter(link => {
        // Check if link has necessary properties
        return link && typeof link === 'object' && link.url && typeof link.url === 'string';
      }).map(link => ({
        url: link.url || '',
        description: link.description || ''
      }));
    }
    
    // Check if a submission already exists
    let submission = await TaskSubmission.findOne({ taskId, userId });
    
    if (submission) {
      try {
        // If submission exists, update it and add to history
        const version = (submission.history?.length || 0) + 1;
        
        // Add current version to history
        submission.history.push({
          version,
          content: submission.content || '',
          files: submission.files || [],
          links: submission.links || [],
          submittedAt: new Date()
        });
        
        // Update with new content
        submission.content = content || '';
        submission.files = validatedFiles;
        submission.links = validatedLinks;
        submission.submittedAt = new Date();
        submission.status = 'pending'; // Reset to pending on resubmission
        
        await submission.save();
      } catch (error) {
        console.error('Error updating existing submission:', error);
        return NextResponse.json({ 
          success: false, 
          error: `Error updating submission: ${error.message}`,
          details: error.stack
        }, { status: 500 });
      }
    } else {
      try {
        // Create new submission document
        const submissionData = {
          taskId,
          userId,
          batchId,
          content: content || '',
          files: validatedFiles,
          links: validatedLinks,
          submittedAt: new Date(),
          history: []
        };
        
        console.log('Creating new submission with data:', JSON.stringify(submissionData, null, 2));
        
        // Create new submission using the validated data
        submission = await TaskSubmission.create(submissionData);
      } catch (error) {
        console.error('Error creating new submission:', error);
        return NextResponse.json({ 
          success: false, 
          error: `Error creating submission: ${error.message}`,
          details: error.stack
        }, { status: 500 });
      }
    }
    
    // Update the task completion in enrollment
    try {
      if (!enrollment.completedTasks.includes(taskId)) {
        enrollment.completedTasks.push(taskId);
        
        // Recalculate progress
        const totalTasks = await Task.countDocuments({ batchId });
        enrollment.progress = Math.round((enrollment.completedTasks.length / totalTasks) * 100);
        
        await enrollment.save();
      }
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      // Continue execution even if progress update fails
    }
    
    return NextResponse.json({ 
      success: true, 
      submission 
    });
  } catch (error) {
    console.error('Error creating task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 
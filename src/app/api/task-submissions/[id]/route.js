import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskSubmission from '@/models/TaskSubmission';

// Get a specific submission
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const submissionId = params.id;
    
    const submission = await TaskSubmission.findById(submissionId)
      .populate('userId', 'name email')
      .populate('taskId', 'title contentType dayNumber')
      .populate('reviewedBy', 'name email');
    
    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      submission 
    });
  } catch (error) {
    console.error('Error fetching task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Update a submission
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const submissionId = params.id;
    const body = await request.json();
    const { content, files, links, status, feedback, grade, reviewedBy } = body;
    
    const submission = await TaskSubmission.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }
    
    // Check if this is a student update or instructor review
    const isReview = status !== undefined || feedback !== undefined || grade !== undefined;
    
    if (isReview) {
      // This is an instructor review
      if (status) submission.status = status;
      if (feedback !== undefined) submission.feedback = feedback;
      if (grade !== undefined) submission.grade = grade;
      if (reviewedBy) submission.reviewedBy = reviewedBy;
      submission.reviewedAt = new Date();
    } else {
      // This is a student resubmission
      // Add current version to history
      const version = (submission.history?.length || 0) + 1;
      
      submission.history.push({
        version,
        content: submission.content,
        files: submission.files,
        links: submission.links,
        submittedAt: new Date()
      });
      
      // Update with new content
      if (content !== undefined) submission.content = content;
      if (files) submission.files = files;
      if (links) submission.links = links;
      submission.submittedAt = new Date();
      submission.status = 'pending'; // Reset to pending on resubmission
    }
    
    await submission.save();
    
    return NextResponse.json({ 
      success: true, 
      submission 
    });
  } catch (error) {
    console.error('Error updating task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Delete a submission
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const submissionId = params.id;
    
    const submission = await TaskSubmission.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }
    
    await TaskSubmission.findByIdAndDelete(submissionId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Submission deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
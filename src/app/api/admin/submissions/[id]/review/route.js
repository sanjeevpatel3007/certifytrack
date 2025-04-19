import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskSubmission from '@/models/TaskSubmission';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const submissionId = params.id;
    const { status, feedback } = await request.json();
    
    // Validation
    if (!submissionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission ID is required' 
      }, { status: 400 });
    }
    
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Valid status is required (approved, rejected, pending)' 
      }, { status: 400 });
    }
    
    // Find and update the submission
    const submission = await TaskSubmission.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }
    
    // Update submission status and feedback
    submission.status = status;
    
    if (feedback) {
      submission.feedback = feedback;
    }
    
    // Add review date and add to history if needed
    submission.reviewedAt = new Date();
    
    await submission.save();
    
    return NextResponse.json({ 
      success: true, 
      message: `Submission ${status === 'approved' ? 'approved' : 'reviewed'}`,
      submission
    });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
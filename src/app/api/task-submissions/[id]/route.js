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
    
    // Debug log for request data
    console.log('Update submission request data:', { 
      submissionId,
      contentLength: content?.length || 0,
      files: files ? `Files array with ${files.length} items` : 'No files',
      links: links ? `Links array with ${links.length} items` : 'No links',
      status, 
      feedbackLength: feedback?.length || 0,
      grade, 
      reviewedBy
    });
    
    // Debug log for files format
    if (files && files.length > 0) {
      console.log('First file structure in update:', JSON.stringify(files[0], null, 2));
    }
    
    // Find submission by ID using lean() to get a plain JS object
    const existingSubmission = await TaskSubmission.findById(submissionId).lean();
    
    if (!existingSubmission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }
    
    // Prepare update data
    const updateData = {};
    
    // Check if this is a student update or instructor review
    const isReview = status !== undefined || feedback !== undefined || grade !== undefined;
    
    if (isReview) {
      // This is an instructor review
      if (status) updateData.status = status;
      if (feedback !== undefined) updateData.feedback = feedback;
      if (grade !== undefined) updateData.grade = grade;
      if (reviewedBy) updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    } else {
      // This is a student resubmission
      try {
        // Calculate the version for history
        const version = ((existingSubmission.history && existingSubmission.history.length) || 0) + 1;
        
        // Prepare history entry
        const historyEntry = {
          version,
          content: existingSubmission.content || '',
          files: existingSubmission.files || [],
          links: existingSubmission.links || [],
          submittedAt: new Date()
        };
        
        // Push to history using $push operator
        updateData.$push = { history: historyEntry };
        
        // Update content if provided
        if (content !== undefined) {
          updateData.content = content;
        }
        
        // Process files if provided
        if (files && Array.isArray(files)) {
          // Validate and normalize each file
          updateData.files = files.filter(file => {
            return file && typeof file === 'object' && file.url && typeof file.url === 'string';
          }).map(file => ({
            url: file.url,
            name: file.name || 'Unnamed file',
            type: file.type || 'unknown',
            size: typeof file.size === 'number' ? file.size : 0,
            publicId: file.publicId || ''
          }));
        }
        
        // Process links if provided
        if (links && Array.isArray(links)) {
          // Validate and normalize each link
          updateData.links = links.filter(link => {
            return link && typeof link === 'object' && link.url && typeof link.url === 'string';
          }).map(link => ({
            url: link.url,
            description: link.description || ''
          }));
        }
        
        // Update submission date and status
        updateData.submittedAt = new Date();
        updateData.status = 'pending'; // Reset to pending on resubmission
      } catch (error) {
        console.error('Error preparing update data:', error);
        return NextResponse.json({ 
          success: false, 
          error: `Error updating submission: ${error.message}`,
          details: error.stack
        }, { status: 500 });
      }
    }
    
    try {
      // Use findByIdAndUpdate instead of save to avoid validation issues
      const updatedSubmission = await TaskSubmission.findByIdAndUpdate(
        submissionId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedSubmission) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to update submission' 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        submission: updatedSubmission
      });
    } catch (error) {
      console.error('Error saving updated submission:', error);
      return NextResponse.json({ 
        success: false, 
        error: `Error saving submission: ${error.message}`,
        details: error.stack
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating task submission:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
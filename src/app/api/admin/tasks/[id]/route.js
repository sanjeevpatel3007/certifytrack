import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Batch from '@/models/Batch';
import cloudinary from '@/lib/cloudinary';

// Get a single task
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const task = await Task.findById(params.id)
      .populate('batchId', 'title courseName durationDays')
      .lean();
    
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ message: 'Failed to fetch task' }, { status: 500 });
  }
}

// Update a task
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Find the task
    const task = await Task.findById(params.id);
    
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    // If dayNumber is changing, check if it's available
    if (data.dayNumber && data.dayNumber !== task.dayNumber) {
      // Validate that the new day is within batch duration
      const batch = await Batch.findById(task.batchId);
      if (data.dayNumber < 1 || data.dayNumber > batch.durationDays) {
        return NextResponse.json({ 
          message: `Day number must be between 1 and ${batch.durationDays}`
        }, { status: 400 });
      }
      
      // Check if the new day is already used by another task
      const existingTask = await Task.findOne({
        batchId: task.batchId,
        dayNumber: data.dayNumber,
        _id: { $ne: params.id } // Exclude the current task
      });
      
      if (existingTask) {
        return NextResponse.json({ 
          message: `A task for day ${data.dayNumber} already exists in this batch`
        }, { status: 409 }); // Conflict
      }
    }
    
    // Update task with new data
    Object.keys(data).forEach(key => {
      task[key] = data[key];
    });
    
    // Update the updatedAt timestamp
    task.updatedAt = new Date();
    
    await task.save();
    
    return NextResponse.json({ 
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}

// Delete a task
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    // Find the task
    const task = await Task.findById(params.id);
    
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    // Helper function to delete resources from Cloudinary
    const deleteFromCloudinary = async (urls) => {
      if (!urls || !Array.isArray(urls) || urls.length === 0) return;
      
      for (const url of urls) {
        if (url && url.includes('cloudinary.com')) {
          const publicId = url.split('/').pop().split('.')[0];
          if (publicId) {
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(
                `certifytrack/${publicId}`,
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
            });
          }
        }
      }
    };
    
    // Delete associated resources from Cloudinary
    await deleteFromCloudinary(task.pdfs);
    await deleteFromCloudinary(task.images);
    
    // Delete the task
    await Task.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
} 
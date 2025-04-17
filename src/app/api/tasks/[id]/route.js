import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Properly unwrap params
    const unwrappedParams = await params;
    const taskId = unwrappedParams.id;
    
    console.log(`Fetching task with ID: ${taskId}`);
    
    const task = await Task.findById(taskId)
      .populate('batchId', 'title courseName')
      .lean();
    
    if (!task) {
      console.log(`Task not found with ID: ${taskId}`);
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    console.log(`Found task: ${task.title}, fields:`, Object.keys(task));
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ message: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // Properly unwrap params
    const unwrappedParams = await params;
    const taskId = unwrappedParams.id;
    
    const body = await request.json();
    
    // Make sure the task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    
    return NextResponse.json({ 
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
} 
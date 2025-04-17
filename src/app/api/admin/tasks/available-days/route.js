import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Batch from '@/models/Batch';

// Get available days for a batch
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get batch ID from query parameters
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    
    if (!batchId) {
      return NextResponse.json({ 
        message: 'Batch ID is required'
      }, { status: 400 });
    }
    
    // Find the batch to get its duration
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ 
        message: 'Batch not found'
      }, { status: 404 });
    }
    
    // Find existing tasks for this batch to determine used days
    const existingTasks = await Task.find({ batchId }).select('dayNumber').lean();
    const usedDays = existingTasks.map(task => task.dayNumber);
    
    // Generate all possible days based on batch duration
    const allDays = Array.from({ length: batch.durationDays }, (_, i) => i + 1);
    
    // Filter out the days that are already used
    const availableDays = allDays.filter(day => !usedDays.includes(day));
    
    return NextResponse.json({ 
      batchId,
      batchTitle: batch.title,
      durationDays: batch.durationDays,
      availableDays,
      usedDays
    });
  } catch (error) {
    console.error('Error fetching available days:', error);
    return NextResponse.json({ message: 'Failed to fetch available days' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';

// Get all batches
export async function GET() {
  try {
    await dbConnect();
    
    const batches = await Batch.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ message: 'Failed to fetch batches' }, { status: 500 });
  }
}

// Create a new batch
export async function POST(request) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'courseName', 'startDate', 
      'bannerImage', 'durationDays', 'instructor', 'maxStudents'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          message: `${field} is required` 
        }, { status: 400 });
      }
    }
    
    // Create new batch
    const newBatch = await Batch.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      message: 'Batch created successfully',
      batch: newBatch
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    return NextResponse.json({ message: 'Failed to create batch' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';

// Get all batches (without filtering for debugging)
export async function GET() {
  try {
    await dbConnect();
    
    // Get all batches without filtering
    const batches = await Batch.find().lean();
    
    return NextResponse.json({ 
      count: batches.length,
      batches 
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch batches',
      error: error.message
    }, { status: 500 });
  }
} 
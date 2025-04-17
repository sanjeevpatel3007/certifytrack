import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';

// Get all batches
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get the search params
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Build query based on parameters
    const query = activeOnly ? { isActive: true } : {};
    
    // Fetch batches
    const batches = await Batch.find(query)
      .sort({ startDate: 1 })
      .lean();
    
    console.log(`Returning ${batches.length} batches from API`);
    
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
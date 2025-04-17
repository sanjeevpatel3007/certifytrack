import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';

// Get a single batch
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Properly unwrap params by awaiting it
    const unwrappedParams = await params;
    const batchId = unwrappedParams.id;
    
    const batch = await Batch.findById(batchId).lean();
    
    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }
    
    return NextResponse.json({ batch });
  } catch (error) {
    console.error('Error fetching batch:', error);
    return NextResponse.json({ message: 'Failed to fetch batch' }, { status: 500 });
  }
} 
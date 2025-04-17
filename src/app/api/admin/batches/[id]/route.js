import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';
import cloudinary from '@/lib/cloudinary';

// Get a single batch
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const batch = await Batch.findById(params.id).lean();
    
    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }
    
    return NextResponse.json({ batch });
  } catch (error) {
    console.error('Error fetching batch:', error);
    return NextResponse.json({ message: 'Failed to fetch batch' }, { status: 500 });
  }
}

// Update a batch
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Find the batch
    const batch = await Batch.findById(params.id);
    
    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }
    
    // Update batch with new data
    Object.keys(data).forEach(key => {
      batch[key] = data[key];
    });
    
    // Update the updatedAt timestamp
    batch.updatedAt = new Date();
    
    await batch.save();
    
    return NextResponse.json({ 
      message: 'Batch updated successfully',
      batch
    });
  } catch (error) {
    console.error('Error updating batch:', error);
    return NextResponse.json({ message: 'Failed to update batch' }, { status: 500 });
  }
}

// Delete a batch
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    // Find the batch
    const batch = await Batch.findById(params.id);
    
    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }
    
    // Delete the banner image from Cloudinary if it exists
    if (batch.bannerImage) {
      // Extract public_id from Cloudinary URL
      const publicId = batch.bannerImage.split('/').pop().split('.')[0];
      
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
    
    // Delete the batch
    await Batch.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json({ message: 'Failed to delete batch' }, { status: 500 });
  }
} 
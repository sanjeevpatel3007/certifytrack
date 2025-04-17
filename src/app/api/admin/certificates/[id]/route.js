import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import cloudinary from '@/lib/cloudinary';

// Get a single certificate
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const certificate = await Certificate.findById(params.id)
      .populate('batchId', 'title courseName')
      .lean();
    
    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
    
    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json({ message: 'Failed to fetch certificate' }, { status: 500 });
  }
}

// Update a certificate
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Find the certificate
    const certificate = await Certificate.findById(params.id);
    
    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
    
    // Update certificate with new data
    Object.keys(data).forEach(key => {
      certificate[key] = data[key];
    });
    
    // Update the updatedAt timestamp
    certificate.updatedAt = new Date();
    
    await certificate.save();
    
    return NextResponse.json({ 
      message: 'Certificate updated successfully',
      certificate
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ message: 'Failed to update certificate' }, { status: 500 });
  }
}

// Delete a certificate
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    // Find the certificate
    const certificate = await Certificate.findById(params.id);
    
    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
    
    // Delete the template image from Cloudinary if it exists
    if (certificate.templateUrl) {
      // Extract public_id from Cloudinary URL
      const publicId = certificate.templateUrl.split('/').pop().split('.')[0];
      
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
    
    // Delete issued certificates from Cloudinary as well
    if (certificate.issuedTo && certificate.issuedTo.length > 0) {
      for (const issued of certificate.issuedTo) {
        if (issued.certificateUrl) {
          const publicId = issued.certificateUrl.split('/').pop().split('.')[0];
          
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
    }
    
    // Delete the certificate
    await Certificate.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ message: 'Failed to delete certificate' }, { status: 500 });
  }
}
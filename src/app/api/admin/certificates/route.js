import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

// Get all certificates
export async function GET() {
  try {
    await dbConnect();
    
    const certificates = await Certificate.find({})
      .sort({ createdAt: -1 })
      .populate('batchId', 'title courseName')
      .lean();
    
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ message: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// Create a new certificate
export async function POST(request) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'batchId', 'templateUrl'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          message: `${field} is required` 
        }, { status: 400 });
      }
    }
    
    // Create new certificate
    const newCertificate = await Certificate.create({
      ...data,
      issuedTo: data.issuedTo || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      message: 'Certificate created successfully',
      certificate: newCertificate
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ message: 'Failed to create certificate' }, { status: 500 });
  }
} 
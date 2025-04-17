import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    await dbConnect();
    
    // In a real app, you would verify the user's admin status using cookies or JWT
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'certificateId', 'recipients'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ 
          message: `${field} is required` 
        }, { status: 400 });
      }
    }
    
    if (!Array.isArray(data.recipients) || data.recipients.length === 0) {
      return NextResponse.json({ 
        message: `recipients must be a non-empty array` 
      }, { status: 400 });
    }
    
    // Find the certificate
    const certificate = await Certificate.findById(data.certificateId);
    
    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
    
    // Process each recipient
    const results = [];
    const errors = [];
    
    for (const recipient of data.recipients) {
      if (!recipient.name || !recipient.email || !recipient.certificateUrl) {
        errors.push({
          recipient,
          error: 'Missing required fields (name, email, or certificateUrl)'
        });
        continue;
      }
      
      // Check if certificate is already issued to this email
      const alreadyIssued = certificate.issuedTo.find(
        issued => issued.email === recipient.email
      );
      
      if (alreadyIssued) {
        errors.push({
          recipient,
          error: 'Certificate already issued to this email'
        });
        continue;
      }
      
      // Generate a unique certificate ID
      const certificateId = uuidv4();
      
      // Add to issuedTo array
      certificate.issuedTo.push({
        userId: recipient.userId || null,
        name: recipient.name,
        email: recipient.email,
        certificateUrl: recipient.certificateUrl,
        certificateId,
        issueDate: new Date()
      });
      
      results.push({
        recipient,
        certificateId,
        success: true
      });
    }
    
    // Update the certificate
    certificate.updatedAt = new Date();
    await certificate.save();
    
    return NextResponse.json({ 
      message: 'Certificates issued successfully',
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error issuing certificates:', error);
    return NextResponse.json({ message: 'Failed to issue certificates' }, { status: 500 });
  }
}
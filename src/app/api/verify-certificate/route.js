import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get the certificate ID from URL params
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    
    if (!certificateId) {
      return NextResponse.json({ 
        message: 'Certificate ID is required',
        valid: false
      }, { status: 400 });
    }
    
    // Find the certificate that contains this certificate ID
    const certificate = await Certificate.findOne({
      'issuedTo.certificateId': certificateId
    }).populate('batchId', 'title courseName startDate');
    
    if (!certificate) {
      return NextResponse.json({ 
        message: 'Certificate not found',
        valid: false
      }, { status: 404 });
    }
    
    // Find the specific issuance within the certificate
    const issuance = certificate.issuedTo.find(
      issued => issued.certificateId === certificateId
    );
    
    if (!issuance) {
      return NextResponse.json({ 
        message: 'Certificate issuance not found',
        valid: false
      }, { status: 404 });
    }
    
    // Check if certificate is expired
    const issueDate = new Date(issuance.issueDate);
    const expiryDate = new Date(issueDate);
    expiryDate.setDate(expiryDate.getDate() + certificate.validityDays);
    
    const now = new Date();
    const isExpired = now > expiryDate;
    
    return NextResponse.json({ 
      valid: !isExpired,
      expired: isExpired,
      certificate: {
        title: certificate.title,
        description: certificate.description,
        courseName: certificate.batchId?.courseName,
        batchTitle: certificate.batchId?.title,
        batchStartDate: certificate.batchId?.startDate,
        issuedTo: issuance.name,
        email: issuance.email,
        issueDate: issuance.issueDate,
        expiryDate: expiryDate,
        certificateUrl: issuance.certificateUrl
      }
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json({ 
      message: 'Failed to verify certificate',
      valid: false 
    }, { status: 500 });
  }
}
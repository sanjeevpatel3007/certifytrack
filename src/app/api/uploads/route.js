import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }
    
    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get original filename and file type
    const originalFilename = file.name;
    const fileType = file.type;
    
    // Generate a unique folder path based on current date
    const now = new Date();
    const folderPath = `task-submissions/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    
    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          resource_type: 'auto',
          filename_override: originalFilename
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve(NextResponse.json({ 
              success: false, 
              error: 'Failed to upload file' 
            }, { status: 500 }));
            return;
          }
          
          // Return successful response with file details
          resolve(NextResponse.json({
            success: true,
            file: {
              url: result.secure_url,
              name: originalFilename,
              type: fileType,
              size: file.size,
              publicId: result.public_id
            }
          }));
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.write(buffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 
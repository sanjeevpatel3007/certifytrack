import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/models/Batch';

// Generate test batches
export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing batches for testing
    // await Batch.deleteMany({});
    
    // Sample batches for testing
    const sampleBatches = [
      {
        title: 'Web Development Bootcamp',
        description: 'A comprehensive course covering HTML, CSS, JavaScript and modern frameworks like React.',
        courseName: 'Web Development',
        startDate: new Date(),
        bannerImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        durationDays: 60,
        whatYouLearn: [
          'HTML5 and CSS3 fundamentals',
          'JavaScript ES6+ programming',
          'React framework',
          'Full-stack development with Node.js',
          'Database design and implementation'
        ],
        prerequisites: [
          'Basic computer knowledge',
          'No prior programming experience required'
        ],
        benefits: [
          'Build professional websites and web applications',
          'Create your own portfolio',
          'Get job-ready skills for web development roles'
        ],
        isActive: true,
        instructor: 'John Doe',
        price: 0,
        maxStudents: 30
      },
      {
        title: 'Data Science Essentials',
        description: 'Learn the fundamentals of data analysis, visualization, and machine learning.',
        courseName: 'Data Science',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        bannerImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        durationDays: 45,
        whatYouLearn: [
          'Data analysis with Python',
          'Statistical methods and hypothesis testing',
          'Data visualization techniques',
          'Machine learning algorithms',
          'Practical data science projects'
        ],
        prerequisites: [
          'Basic programming knowledge',
          'Understanding of mathematics'
        ],
        benefits: [
          'Analyze complex datasets',
          'Make data-driven decisions',
          'Apply machine learning to real-world problems'
        ],
        isActive: true,
        instructor: 'Jane Smith',
        price: 99.99,
        maxStudents: 25
      },
      {
        title: 'UX/UI Design Fundamentals',
        description: 'Master the principles of user experience and interface design.',
        courseName: 'UX/UI Design',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        bannerImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        durationDays: 30,
        whatYouLearn: [
          'User research methods',
          'Information architecture',
          'Wireframing and prototyping',
          'Visual design principles',
          'User testing and iteration'
        ],
        prerequisites: [
          'No prior design experience required',
          'Interest in visual and interactive design'
        ],
        benefits: [
          'Create user-centered designs',
          'Build a design portfolio',
          'Apply UX methods to digital products'
        ],
        isActive: true,
        instructor: 'Michael Johnson',
        price: 79.99,
        maxStudents: 20
      }
    ];
    
    // Check if we already have batches
    const existingCount = await Batch.countDocuments();
    
    if (existingCount === 0) {
      // Insert sample batches if none exist
      await Batch.insertMany(sampleBatches);
      return NextResponse.json({ 
        message: `Created ${sampleBatches.length} sample batches`,
        count: sampleBatches.length
      });
    } else {
      return NextResponse.json({ 
        message: `Database already has ${existingCount} batches`,
        count: existingCount
      });
    }
  } catch (error) {
    console.error('Error seeding batches:', error);
    return NextResponse.json({ 
      message: 'Failed to seed batches',
      error: error.message
    }, { status: 500 });
  }
} 
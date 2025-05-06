import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true
  }
});

const ContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'quiz', 'assignment', 'reading', 'project'],
    required: true
  },
  videoUrl: String,
  assignment: String,
  quiz: [QuestionSchema],
  readingContent: String,
  projectDetails: String
});

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dayNumber: { 
    type: Number, 
    required: true,
    min: 1
  },
  batchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Batch',
    required: true 
  },
  // For backward compatibility
  contentType: {
    type: String,
    enum: ['video', 'quiz', 'assignment', 'reading', 'project'],
    required: true,
    default: function() {
      // Set contentType based on first content in contents array
      return this.contents && this.contents.length > 0 ? this.contents[0].type : 'video';
    }
  },
  // For backward compatibility
  videoUrl: String,
  assignment: String,
  quiz: [QuestionSchema],
  contents: {
    type: [ContentSchema],
    required: true,
    validate: {
      validator: function(contents) {
        return contents && contents.length > 0;
      },
      message: 'At least one content type is required'
    }
  },
  resources: {
    type: [String],
    default: []
  },
  pdfs: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  codeSnippets: {
    type: [String],
    default: []
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save middleware to sync contentType and contents
TaskSchema.pre('save', function(next) {
  // If contents exist, sync the first content type to contentType
  if (this.contents && this.contents.length > 0) {
    this.contentType = this.contents[0].type;
    
    // Sync the content data based on type
    const firstContent = this.contents[0];
    switch (firstContent.type) {
      case 'video':
        this.videoUrl = firstContent.videoUrl;
        break;
      case 'assignment':
        this.assignment = firstContent.assignment;
        break;
      case 'quiz':
        this.quiz = firstContent.quiz;
        break;
    }
  }
  
  // If no contents but contentType exists, create contents from legacy fields
  else if (this.contentType) {
    this.contents = [{
      type: this.contentType,
      videoUrl: this.videoUrl,
      assignment: this.assignment,
      quiz: this.quiz
    }];
  }
  
  next();
});

// Compound index to ensure one task per day per batch
TaskSchema.index({ batchId: 1, dayNumber: 1 }, { unique: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema); 
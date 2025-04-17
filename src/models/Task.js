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
  videoUrl: { 
    type: String 
  },
  contentType: { 
    type: String,
    enum: ['video', 'quiz', 'assignment', 'reading', 'project'],
    required: true 
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
  quiz: {
    type: [QuestionSchema],
    default: []
  },
  assignment: {
    type: String
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

// Compound index to ensure one task per day per batch
TaskSchema.index({ batchId: 1, dayNumber: 1 }, { unique: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema); 
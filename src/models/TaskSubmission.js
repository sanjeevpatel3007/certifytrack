import mongoose from 'mongoose';

const TaskSubmissionSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  files: [{
    url: String,
    name: String,
    type: String,
    size: Number,
    publicId: String
  }],
  links: [{
    url: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: {
    type: String,
    default: ''
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  history: [{
    version: Number,
    content: String,
    files: [{
      url: String,
      name: String,
      type: String,
      size: Number,
      publicId: String
    }],
    links: [{
      url: String,
      description: String
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Compound index to ensure one submission per user per task
TaskSubmissionSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export default mongoose.models.TaskSubmission || mongoose.model('TaskSubmission', TaskSubmissionSchema); 
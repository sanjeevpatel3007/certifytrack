import mongoose from 'mongoose';

// Define a schema for file objects
const FileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Unnamed file'
  },
  type: {
    type: String,
    default: 'unknown'
  },
  size: {
    type: Number,
    default: 0
  },
  publicId: {
    type: String,
    default: ''
  }
}, { _id: false });

// Define a schema for link objects
const LinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { _id: false });

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
  files: [FileSchema],
  links: [LinkSchema],
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
    files: [FileSchema],
    links: [LinkSchema],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Compound index to ensure one submission per user per task
TaskSubmissionSchema.index({ taskId: 1, userId: 1 }, { unique: true });

// Handle JSON stringify of objects
TaskSubmissionSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    return ret;
  }
});

export default mongoose.models.TaskSubmission || mongoose.model('TaskSubmission', TaskSubmissionSchema); 
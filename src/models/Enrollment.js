import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
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
  enrolledDate: { 
    type: Date, 
    default: Date.now 
  },
  // Track progress
  progress: {
    type: Number, // Percentage of tasks completed (0-100)
    default: 0
  },
  completedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  // Status can be: active, completed, withdrawn
  status: {
    type: String,
    enum: ['active', 'completed', 'withdrawn'],
    default: 'active'
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only enroll once in a batch
EnrollmentSchema.index({ userId: 1, batchId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema); 
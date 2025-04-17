import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  courseName: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  bannerImage: { 
    type: String, 
    required: true 
  },
  durationDays: { 
    type: Number, 
    required: true 
  },
  whatYouLearn: {
    type: [String],
    default: []
  },
  prerequisites: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  instructor: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  maxStudents: { 
    type: Number, 
    required: true 
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

export default mongoose.models.Batch || mongoose.model("Batch", BatchSchema); 
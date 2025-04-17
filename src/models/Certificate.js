import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  batchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Batch',
    required: true 
  },
  templateUrl: { 
    type: String, 
    required: true 
  },
  issuedTo: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    certificateUrl: {
      type: String,
      required: true
    },
    certificateId: {
      type: String,
      required: true,
      unique: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    }
  }],
  validityDays: {
    type: Number,
    default: 365 // Default validity of 1 year
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

export default mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema); 
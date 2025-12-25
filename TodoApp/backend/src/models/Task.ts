import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  deadline: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  category?: string;
  userId: mongoose.Types.ObjectId;
}

const taskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  category: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// Index for better query performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, priority: 1 });

export default mongoose.model<ITask>("Task", taskSchema);

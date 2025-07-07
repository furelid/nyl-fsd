import mongoose from "mongoose";

export interface ITask {
  title: string;
  createdAt?: Date;
}

export const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model<ITask>("Task", taskSchema);
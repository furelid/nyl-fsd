import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = await mongoose.connect(process.env.MONGO_URI || '', {
  // Options can be added here if needed
});

if (client) {
  console.log('Connected to MongoDB');
} else {
  console.error('Failed to connect to MongoDB');
}

interface ITask {
  title: string;
  createdAt?: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>('Task', taskSchema);

// API Endpoints
app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { Task } from './schema';
import { db } from "./db";  

const app = express();
const PORT = 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Database connection
if (db) {
  console.log('Connected to MongoDB');
}



// API Endpoints
app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
    } else {
      // Check if task already exists
      const existingTask = await Task.findOne({ title });
      if (existingTask) {
        res.status(409).json({ message: 'Task already exists' });
      } else {
        const newTask = new Task({ title });
        await newTask.save();
        res.status(201).json({ data: newTask });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task', error });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully', data: deletedTask });
    }
  } catch (error) { 
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

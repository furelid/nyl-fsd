<template>
  <div>
    <h1>To-Do List</h1>
    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="Enter a new task" />
      <button type="submit">Add Task</button>
       <p v-if="tasks.length === 0 && !errorMessage" class="warning">No tasks available. Please add a task.</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="!newTask.trim()">Please enter a task.</p>



    </form>

    <ul>
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
        <button @click="deleteTask(task._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import axios, { AxiosError } from 'axios';

type Task = {
  _id: string;
  title: string;
};

const tasks: Ref<Task[]> = ref([]);
const newTask: Ref<string> = ref('');
const errorMessage: Ref<string> = ref('');

const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    tasks.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};

const addTask = async () => {
  if (!newTask.value.trim()) return;
 
  try {
    const response = await axios.post('http://localhost:3000/tasks', { title: newTask.value });

    switch (response.status) {
      case 201:
        tasks.value.push(response.data.data);
        newTask.value = '';
        errorMessage.value = '';
        break;
      default:
        console.error('Unexpected response status:', response.status);
    } 
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status } = error.response;
      switch (status) {
        case 409:
          errorMessage.value = 'Task already exists';
          break;
        default:
          console.error('Failed to add task:', error);
      }
    }
  }
};

const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:3000/tasks/${id}`);
    tasks.value = tasks.value.filter(task => task._id !== id);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

onMounted(fetchTasks);
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  margin-right: 0.5rem;
}

button {
  padding: 0.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}

li button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

li button:hover {
  background-color: #ff1a1a;
}

p { 
  font-size: 0.9rem;
}

p.error {
  color: red; 
}

p.success {
  color: green; 
}

p.warning {
  color: orange; 
}
</style>

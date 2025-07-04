<template>
  <div>
    <h1>To-Do List</h1>
    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="Enter a new task" />
      <button type="submit">Add Task</button>
    </form>

    <ul>
      <li v-for="task in tasks" :key="task._id">{{ task.title }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tasks = ref([]);
const newTask = ref('');

const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};

const addTask = async () => {
  if (!newTask.value.trim()) return;

  try {
    const response = await axios.post('http://localhost:3000/tasks', { title: newTask.value });
    tasks.value.push(response.data);
    newTask.value = '';
  } catch (error) {
    console.error('Failed to add task:', error);
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
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}
</style>

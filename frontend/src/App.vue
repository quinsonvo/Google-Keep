<template>
  <div class="app">
    <h1>Todo App</h1>

    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="New task..." />
      <button type="submit">Add</button>
    </form>

    <ul>
      <li v-for="task in tasks" :key="task.id" style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <input type="checkbox" v-model="selectedIds" :value="task.id" style="margin-right: 10px;" />
          <input type="checkbox" :checked="task.done" @change="toggleTask(task.id)" />
          <span :style="{ textDecoration: task.done ? 'line-through' : 'none', marginLeft: '10px' }">{{ task.title }}</span>
        </div>
        <button @click="confirmDelete(task.id)" style="margin-left: 10px; color: red">🗑</button>
      </li>
    </ul>
    <button @click="confirmDeleteMultiple" :disabled="selectedIds.length === 0" style="margin-top: 20px;">
      Xoá {{ selectedIds.length }} task đã chọn
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const tasks = ref([]);
const newTask = ref("");
const selectedIds = ref([])

const fetchTasks = async () => {
  const res = await axios.get("http://localhost:3000/api/tasks");
  tasks.value = res.data;
};

const addTask = async () => {
  if (!newTask.value.trim()) return;
  const res = await axios.post("http://localhost:3000/api/tasks", {
    title: newTask.value,
  });
  tasks.value.push(res.data);
  newTask.value = "";
};

const toggleTask = async (id) => {
  const res = await axios.patch(`http://localhost:3000/api/tasks/${id}`);
  const index = tasks.value.findIndex((t) => t.id === id);
  tasks.value[index] = res.data;
};

const deleteTask = async (id) => {
  await axios.delete(`http://localhost:3000/api/tasks/${id}`);
  tasks.value = tasks.value.filter(t => t.id !== id);
  alert('🗑️ Đã xoá task thành công!');
}

const confirmDelete = async (id) => {
  const yes = confirm('Bạn có chắc muốn xoá task này?');
  if (yes) {
    await deleteTask(id);
  }
}

const confirmDeleteMultiple = async () => {
  const yes = confirm(`Bạn có chắc muốn xoá ${selectedIds.value.length} task?`);
  if (yes) {
    for (const id of selectedIds.value) {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
    }
    tasks.value = tasks.value.filter(t => !selectedIds.value.includes(t.id));
    alert('🗑️ Đã xoá các task thành công!');
    selectedIds.value = [];
  }
}

onMounted(fetchTasks);
</script>

<style>
.app {
  max-width: 500px;
  margin: 50px auto;
  font-family: sans-serif;
}

input[type="text"] {
  width: 70%;
  padding: 8px;
}

button {
  padding: 8px 12px;
  margin-left: 10px;
}

li {
  margin: 8px 0;
}
</style>

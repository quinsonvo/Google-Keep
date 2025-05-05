<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const notes = ref([])
const newNote = ref({ title: '', content: '', color: '#ffffff' })

const fetchNotes = async () => {
  const res = await axios.get('http://localhost:3000/api/notes')
  notes.value = res.data
}

const createNote = async () => {
  if (!newNote.value.title && !newNote.value.content) return
  await axios.post('http://localhost:3000/api/notes', newNote.value)
  newNote.value = { title: '', content: '', color: '#ffffff' }
  fetchNotes()
}

const deleteNote = async (id) => {
  await axios.delete(`http://localhost:3000/api/notes/${id}`)
  fetchNotes()
}

onMounted(fetchNotes)
</script>

<template>
  <main style="max-width: 900px; margin: auto; padding: 20px;">
    <h1>📝 Mini Keep</h1>

    <div style="margin-bottom: 20px;">
      <input v-model="newNote.title" placeholder="Tiêu đề" style="width: 100%; margin-bottom: 5px;" />
      <textarea v-model="newNote.content" placeholder="Ghi chú..." style="width: 100%; margin-bottom: 5px;"></textarea>
      <input v-model="newNote.color" type="color" style="margin-bottom: 5px;" />
      <button @click="createNote">➕ Thêm ghi chú</button>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      <div
        v-for="note in notes"
        :key="note.id"
        :style="{ background: note.color, padding: '10px', borderRadius: '8px', width: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }"
      >
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <button @click="deleteNote(note.id)" style="color: red;">🗑️ Xoá</button>
      </div>
    </div>
  </main>
</template>

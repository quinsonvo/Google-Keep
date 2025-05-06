<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import NoteItem from './components/NoteItem.vue';
import NoteList from './components/NoteList.vue';
import NoteEditor from './components/NoteEditor.vue';

const toast = useToast()

const notes = ref([]);
const editingNote = ref(null)
const newNote = ref({ title: '', content: '', color: '#ffffff' })
const isLoading = ref(false)

const fetchNotes = async () => {
  isLoading.value = true
  const res = await axios.get('http://localhost:3000/api/notes')
  notes.value = res.data
  isLoading.value = false
}

const createNote = async () => {
  if (!newNote.value.title && !newNote.value.content) return
  await axios.post('http://localhost:3000/api/notes', newNote.value)
  newNote.value = { title: '', content: '', color: '#ffffff' }
  toast.success("Đã thêm ghi chú!")
  fetchNotes()
}

const deleteNote = async (id) => {
  await axios.delete(`http://localhost:3000/api/notes/${id}`)
  toast.success("Đã xóa ghi chú!")
  fetchNotes()
}

const saveEdit = async () => {
  await axios.put(`http://localhost:3000/api/notes/${editingNote.value.id}`, editingNote.value)
  editingNote.value = null
  toast.success("Đã sửa ghi chú!")
  fetchNotes()
}

const togglePin = async (note) => {
  const updated = { ...note, pinned: note.pinned ? 0 : 1 }
  await axios.put(`http://localhost:3000/api/notes/${note.id}`, updated)
  toast.success("Đã ghim/bỏ ghim ghi chú!")
  fetchNotes()
}


onMounted(fetchNotes)
</script>

<template>
  <div>
    <main style="max-width: 900px; margin: auto; padding: 20px;">
      <h1>📝 Mini Keep</h1>

      <div style="margin-bottom: 20px;">
        <input v-model="newNote.title" placeholder="Tiêu đề" style="width: 100%; margin-bottom: 5px;" />
        <textarea v-model="newNote.content" placeholder="Ghi chú..." style="width: 100%; margin-bottom: 5px;"></textarea>
        <input v-model="newNote.color" type="color" style="margin-bottom: 5px;" />
        <button @click="createNote">➕ Thêm ghi chú</button>
      </div>
      <p v-if="isLoading">Đang tải...</p>


      <NoteList
        :notes="notes"
        @edit="editingNote = { ...$event }"
        @delete="deleteNote"
        @toggle-pin="togglePin"
      />
    </main>
    <NoteEditor
      v-if="editingNote"
      :note="editingNote"
      @save="saveEdit"
      @close="editingNote = null"
    />

  </div>

</template>
<style>
</style>

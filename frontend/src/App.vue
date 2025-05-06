<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
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


      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
        <div v-for="note in notes" :key="note.id"
          :style="{ background: note.color, padding: '10px', borderRadius: '8px', minHeight: '100px' }"
          @click="editingNote = { ...note }"
        >
          <h3>{{ note.title }}</h3> 
          <p>{{ note.content }}</p>
          <button @click.stop="deleteNote(note.id)" style="color: red;">🗑️ Xoá</button>
          <button @click.stop="togglePin(note)">{{ note.pinned ? '📌 Bỏ ghim' : '📌 Ghim' }}</button>
        </div>
      </div>
    </main>
    <div v-if="editingNote" class="modal">
      <input v-model="editingNote.title" placeholder="Tiêu đề" />
      <textarea v-model="editingNote.content" placeholder="Nội dung..." />
      <input v-model="editingNote.color" type="color" />
      <label><input type="checkbox" v-model="editingNote.pinned" /> Ghim</label>
      <button @click="saveEdit">💾 Lưu</button>
      <button @click="editingNote = null">❌ Đóng</button>
    </div>

  </div>

</template>
<style>
.modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
</style>

import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export function useNotes() {
  const toast = useToast()
  const notes = ref([])
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
    await axios.post('http://localhost:3000/api/notes', newNote.value);
    console.log(newNote.value);
    newNote.value = { title: '', content: '', color: '#ffffff', pinned: 0 , label: '' };
    toast.success("Đã thêm ghi chú!");
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

  return { notes, fetchNotes, createNote, deleteNote, saveEdit, togglePin, isLoading, newNote, editingNote }
}

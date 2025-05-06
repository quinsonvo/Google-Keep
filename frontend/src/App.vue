<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NoteItem from './components/NoteItem.vue';
import NoteList from './components/NoteList.vue';
import NoteEditor from './components/NoteEditor.vue';
import { useNotes } from './composables/useNotes.js';

const {
  notes,
  fetchNotes,
  createNote,
  deleteNote,
  saveEdit,
  togglePin,
  isLoading,
  newNote,
  editingNote,
} = useNotes();



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

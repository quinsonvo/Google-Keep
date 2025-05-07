<script setup>
import { ref, onMounted, computed } from 'vue';
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

const searchText = ref('');
const selectedLabel = ref('');

const labels = computed(() => {
  return [...new Set(notes.value.map(n => n.label).filter(Boolean))];
});

const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    const matchSearch =
      note.title.includes(searchText.value) ||
      note.content.includes(searchText.value);

    const matchLabel =
      selectedLabel.value === '' || note.label === selectedLabel.value;

    return matchSearch && matchLabel;
  });
});

onMounted(fetchNotes);
</script>

<template>
  <div>
    <main style="max-width: 900px; margin: auto; padding: 20px;">
      <h1>📝 Mini Keep</h1>

      <div style="margin-bottom: 20px;">
        <input v-model="newNote.title" placeholder="Tiêu đề" style="width: 100%; margin-bottom: 5px;" />
        <textarea v-model="newNote.content" placeholder="Ghi chú..." style="width: 100%; margin-bottom: 5px;"></textarea>
        <input v-model="newNote.color" type="color" style="margin-bottom: 5px;" />
        <input type="checkbox" v-model="newNote.pinned" /> Ghim
        <input v-model="newNote.label" placeholder="Nhãn (VD: Công việc, Cá nhân)" />

        <button @click="createNote">Thêm ghi chú</button>
      </div>
      <input v-model="searchText" placeholder="🔍 Tìm kiếm..." />
      <select v-model="selectedLabel">
        <option value="">-- Tất cả --</option>
        <option
          v-for="l in labels"
          :key="l"
          :value="l"
        >{{ l }}</option>
      </select>
      <p v-if="isLoading">Đang tải...</p>

      <p v-if="!isLoading && notes.length === 0">Không có ghi chú nào.</p>
      <NoteList
        :notes="filteredNotes"
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

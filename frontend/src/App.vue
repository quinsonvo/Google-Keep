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
const isFormExpanded = ref(false);
const currentMenu = ref('note');
const sidebarOpen = ref(true);
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
  <div class="app-layout">
    <!-- Topbar -->
    <header class="topbar">
      <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
        <span v-if="sidebarOpen">☰</span>
        <span v-else>☰</span>
      </button>
      <input
        v-model="searchText"
        placeholder="🔍 Tìm kiếm..."
        class="topbar-search"
      />
      <!-- You can add more topbar items here -->
    </header>
    <!-- Sidebar -->
    <aside :class="['sidebar', { closed: !sidebarOpen }]">
      <ul>
        <li :class="{ active: currentMenu === 'note' }" @click="currentMenu = 'note'">
          <span class="sidebar-icon">
            <!-- Lightbulb (Note) -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" fill="white"/></svg>
          </span>
          <span class="sidebar-label" v-if="sidebarOpen">Note</span>
        </li>
        <li :class="{ active: currentMenu === 'archived' }" @click="currentMenu = 'archived'">
          <span class="sidebar-icon">
            <!-- Archive -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z" fill="white"/></svg>
          </span>
          <span class="sidebar-label" v-if="sidebarOpen">Archived</span>
        </li>
        <li :class="{ active: currentMenu === 'bin' }" @click="currentMenu = 'bin'">
          <span class="sidebar-icon">
            <!-- Bin -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </span>
          <span class="sidebar-label" v-if="sidebarOpen">Bin</span>
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <div
        @click="isFormExpanded = true"
        style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 8px; cursor: pointer;"
      >
        <div v-if="!isFormExpanded">
          <input
            v-model="newNote.title"
            placeholder="Thêm ghi chú..."
            style="width: 100%; border: none; outline: none;"
          />
        </div>
        <div v-else style="display: grid; grid-template-columns: 1fr auto; gap: 10px;">
          <div style="margin-bottom: 20px;">
            <input v-model="newNote.title" placeholder="Tiêu đề" style="width: 100%; margin-bottom: 5px;" class="transparent-input"/>
            <textarea v-model="newNote.content" placeholder="Ghi chú..." style="width: 100%; margin-bottom: 5px;" class="transparent-input auto-expand" rows="1"></textarea>
            <input v-model="newNote.color" type="color" style="margin-bottom: 5px;" />
            <input type="checkbox" v-model="newNote.pinned" /> Ghim
            <input v-model="newNote.label" placeholder="Nhãn (VD: Công việc, Cá nhân)" />
            <button @click="createNote">Thêm ghi chú</button>
            <button @click.stop="isFormExpanded = false">Close</button>
          </div>
        </div>
      </div>

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
/* Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  align-items: stretch;
}

/* Topbar */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 56px;
  background: #222;
  color: #fff;
  display: flex;
  align-items: center;
  z-index: 10;
  padding: 0 20px;
  box-sizing: border-box;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin-right: 20px;
  cursor: pointer;
}

.topbar-search {
  flex: 1;
  max-width: 400px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 1em;
  margin-left: 10px;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 56px; /* below topbar */
  left: 0;
  height: calc(100vh - 56px);
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  background: #222;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  padding: 30px 0;
  transition: width 0.2s;
  z-index: 5;
  overflow-x: hidden;
}

.sidebar.closed {
  width: 56px;
  min-width: 56px;
  max-width: 56px;
  padding: 30px 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 16px 15px 16px;
  cursor: pointer;
  color: #fff;
  transition: background 0.2s, padding 0.2s, gap 0.2s;
  white-space: nowrap;
  border: none;
  background: none;
  gap: 16px;
}

.sidebar li.active,
.sidebar li:hover {
  background: rgba(255,255,255,.15);
  font-weight: bold;
}

.sidebar.closed li {
  padding: 15px 16px 15px 16px;
  gap: 0;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  min-width: 2em;
  /* Remove margin-right! */
  transition: margin 0.2s;
}

.sidebar.closed .sidebar-icon {
  margin-right: 0;
}

.sidebar-label {
  transition: opacity 0.2s, width 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.closed .sidebar-label {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  pointer-events: none;
  display: inline-block;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  margin-top: 56px;
  transition: margin-left 0.2s;
}

.sidebar.closed ~ .main-content {
  margin-left: 56px;
}

/* Inputs & Form */
.transparent-input {
  background-color: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
}

.auto-expand {
  overflow: hidden;
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
}

/* Responsive */
@media (max-width: 600px) {
  .sidebar {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
  }
  .sidebar.closed {
    width: 48px;
    min-width: 48px;
    max-width: 48px;
  }
  .main-content {
    margin-left: 120px;
    padding: 16px;
  }
  .sidebar.closed ~ .main-content {
    margin-left: 48px;
  }
}
</style>



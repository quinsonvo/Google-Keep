<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
    <div v-if="pinnedNotes.length">
      <h3>📌 Được ghim</h3>
      <NoteItem
        v-for="note in pinnedNotes"
        :key="note.id"
        :note="note"
        @edit="editNote"
        @delete="deleteNote"
        @toggle-pin="togglePin"
      />
    </div>
  
    <div v-if="otherNotes.length">
      <h3>📝 Ghi chú khác</h3>
      <NoteItem
        v-for="note in otherNotes"
        :key="note.id"
        :note="note"
        @edit="editNote"
        @delete="deleteNote"
        @toggle-pin="togglePin"
      />
    </div>
  </div>
</template>

<script>
import NoteItem from './NoteItem.vue';

export default {
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  components: {
    NoteItem,
  },
  computed: {
    pinnedNotes() {
      return this.notes.filter(note => note.pinned);
    },
    otherNotes() {
      return this.notes.filter(note => !note.pinned);
    },
  },
  emits: ['edit', 'delete', 'toggle-pin'],
  methods: {
    editNote(note) {
      this.$emit('edit', note);
    },
    deleteNote(id) {
      this.$emit('delete', id);
    },
    togglePin(note) {
      this.$emit('toggle-pin', note);
    },
  },
};
</script>
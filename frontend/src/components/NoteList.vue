<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
    <NoteItem
      v-for="note in notes"
      :key="note.id"
      :note="note"
      @edit="editNote"
      @delete="deleteNote"
      @toggle-pin="togglePin"
    />
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
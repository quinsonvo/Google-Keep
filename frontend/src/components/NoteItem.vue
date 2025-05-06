<template>
  <div
    :style="{ background: note.color, padding: '10px', borderRadius: '8px', minHeight: '100px' }"
    @click="editNote"
  >
    <h3>{{ note.title }}</h3>
    <p>{{ note.content }}</p>
    <button @click.stop="deleteNote" style="color: red;">🗑️ Xoá</button>
    <button @click.stop="togglePin">{{ note.pinned ? '📌 Bỏ ghim' : '📌 Ghim' }}</button>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit', 'delete', 'toggle-pin'],
  methods: {
    editNote() {
      this.$emit('edit', this.note);
    },
    deleteNote() {
      this.$emit('delete', this.note.id);
    },
    togglePin() {
      this.$emit('toggle-pin', this.note);
    },
  },
};
</script>
<template>
  <div v-if="note" class="modal">
    <input v-model="note.title" placeholder="Tiêu đề" /><br>
    <textarea v-model="note.content" placeholder="Nội dung..." /><br>
    <input v-model="note.color" type="color" /><br>
    <input v-model="note.label" placeholder="Nhãn (VD: Công việc, Cá nhân)" /><br>
    <input type="checkbox" v-model="note.pinned" /> Ghim<br>
    <button @click="save">💾 Lưu</button>
    <button @click="close">❌ Đóng</button>
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
  emits: ['save', 'close'],
  methods: {
    save() {
      this.$emit('save', this.note);
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  padding: 20px;
  border-radius: 8px;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
</style>
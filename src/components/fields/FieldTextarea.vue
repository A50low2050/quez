<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <label :for="field.id" class="form-label text-primary fs-6 fw-semibold mb-0">
        {{ field.label || field.title }}
      </label>

      <label v-if="errorMessage" class="form-label text-danger mb-0 fw-semibold text-end">
        {{ errorMessage }}
      </label>
    </div>

    <textarea
      :id="field.id"
      :name="field.name"
      :placeholder="field.placeholder"
      v-model="model"
      class="form-control fw-bold text-primary p-3"
      :class="{ 'border-danger': errorMessage }"
      rows="3"
    ></textarea>
  </div>
</template>

<script setup>
const model = defineModel()

defineProps({
  field: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
})
</script>

<style scoped>
textarea {
  resize: vertical;
  min-height: 80px;
}
</style>

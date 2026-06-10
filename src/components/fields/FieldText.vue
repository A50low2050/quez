<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <label :for="field.id" class="form-label text-primary fs-6 fw-semibold mb-0">
        {{ field.label || field.title }}
      </label>
      <label v-if="errorMessage" class="form-label text-danger mb-0 fw-semibold">
        {{ errorMessage }}
      </label>
    </div>

    <input
      :type="field.type"
      :id="field.id"
      :name="field.name"
      :placeholder="field.placeholder"
      v-model="model"
      class="form-control fw-bold text-primary p-3"
      :class="{ 'border-danger': errorMessage }"
    />
  </div>
</template>

<script setup>
const model = defineModel()

defineProps({
  field: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
})
</script>

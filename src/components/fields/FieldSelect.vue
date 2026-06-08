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

    <select
      :id="field.id"
      :name="field.name"
      v-model="model"
      class="form-select fw-bold text-primary p-3 cursor-pointer"
      :class="{ 'border-danger': errorMessage }"
    >
      <option value="" disabled selected>Выберите вариант...</option>

      <option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
const model = defineModel()

defineProps({
  field: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
})
</script>

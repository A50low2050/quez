<template>
  <div class="mb-3">
    <label
      class="pick-adds border rounded d-flex p-3 align-items-center justify-content-between cursor-pointer mb-0"
      :class="{ 
        'active-card': model === field.value,
        'border-danger': errorMessage 
      }"
    >
      <div class="d-flex align-items-center w-100">
        <input 
          type="radio" 
          :name="field.name" 
          :id="field.id" 
          :value="field.value" 
          v-model="model" 
          class="d-none" 
        />

        <div
          class="custome-radio cursor-pointer flex-shrink-0"
          :class="{ checked: model === field.value }"
        ></div>

        <div class="ms-3 flex-grow-1">
          <h5 class="text-primary mb-0">{{ field.label || field.title }}</h5>
        </div>
      </div>
    </label>

    <small v-if="errorMessage && index === 0" class="text-danger d-block mt-2">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup>
const model = defineModel()

defineProps({
  field: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
  index: { type: Number, default: 0 }
})
</script>

<style scoped>
.custome-radio {
  width: 22px;
  height: 22px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease-in-out;
}

.custome-radio.checked {
  border-color: var(--bs-primary);
}

.custome-radio.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: var(--bs-primary);
  border-radius: 50%;
}
</style>
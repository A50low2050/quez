<template>
  <div>
    <label
      class="pick-adds border rounded d-flex p-3 align-items-center justify-content-between cursor-pointer"
      :class="{ 
        'active-card': model,
        'border-danger': errorMessage
      }"
    >
      <div class="d-flex align-items-center w-100">
        <input type="checkbox" :id="field.id" v-model="model" class="d-none" />

        <div
          class="custome-checkbox cursor-pointer flex-shrink-0"
          :class="{ checked: model }"
        ></div>

        <div class="ms-3 flex-grow-1">
          <h5 class="text-primary mb-0">{{ field.label || field.title }}</h5>
        </div>
      </div>
    </label>
    <small v-if="errorMessage" class="text-danger d-block mt-1">{{ errorMessage }}</small>
  </div>
</template>

<script setup>
const model = defineModel()

defineProps({
  field: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
})
</script>
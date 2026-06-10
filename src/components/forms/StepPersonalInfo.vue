<template>
  <div class="step-content">
    <h2 class="text-primary fw-semibold mb-3">{{ data.title }}</h2>
    <p class="text-light mb-3">{{ data.description }}</p>

    <p v-if="data.highlight_text" class="fw-bold mb-3">{{ data.highlight_text }}</p>

    <div v-for="(question, qIndex) in data.questions" :key="qIndex" class="mb-3">
      <h4 class="mb-3">{{ question.title }}</h4>

      <div v-for="field in question.fields" :key="field.id" class="mb-3">
        <component
          :is="componentMap[field.type]"
          :field="field"
          v-model="model[field.name]"
          :error-message="errors[field.name]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FieldText from '../fields/FieldText.vue'
import FieldCheckbox from '../fields/FieldCheckbox.vue'
import FieldTextarea from '../fields/FieldTextarea.vue'
import FieldSelect from '../fields/FieldSelect.vue'
import FieldRadio from '../fields/FieldRadio.vue'

const model = defineModel({
  type: Object,
  required: true,
  default: () => ({}),
})

defineProps({
  data: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
})

const componentMap = {
  text: FieldText,
  email: FieldText,
  tel: FieldText,
  number: FieldText,
  checkbox: FieldCheckbox,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
}
</script>

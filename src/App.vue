<template>
  <main class="main min-vh-100 w-100 bg-magnolia py-4 py-lg-5 d-flex align-items-center justify-content-center">
    <div class="container-wrapper d-lg-flex align-items-center h-100">
      <div class="form-wrapper w-100 d-flex flex-column flex-lg-row p-0 p-lg-4 shadow-sm">
        <SidebarNav :current-step="activeStep" :data="data" @change-step="setStep" />

        <form
          v-if="!isSubmitted"
          class="form-main h-100 flex-grow-1 d-flex flex-column justify-content-between"
        >
          <div
            ref="scrollContainer"
            class="form-info px-4 py-4 flex-grow-1"
            style="overflow-y: auto; height: 0"
          >
            <StepPersonalInfo
              v-if="currentStep"
              :key="currentStep.id"
              :data="currentStep"
              v-model="formData"
              :errors="errors"
            />
          </div>

          <div
            class="text-end px-3 px-lg-0 bg-white py-3 py-lg-0 d-flex justify-content-between align-items-center"
          >
            <FormButtonBack v-if="activeStep > 1" @click.prevent="activeStep--">
              Go Back
            </FormButtonBack>

            <FormButtonNext class="ms-auto" @click.prevent="validateHandleData">
              {{ activeStep === data.length ? 'Confirm' : 'Next Step' }}
            </FormButtonNext>
          </div>
        </form>

        <SuccessSumbitForm v-else />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import SidebarNav from '@/components/navbar/SidebarNav.vue'
import StepPersonalInfo from './components/forms/StepPersonalInfo.vue'
import SuccessSumbitForm from './components/forms/SuccessSumbitForm.vue'

import FormButtonNext from './ui/FormButtonNext.vue'
import FormButtonBack from './ui/FormButtonNext.vue'

const props = defineProps({
  initialData: {
    type: [String, Object],
    default: () => ({}),
  },
})

// import DataJson from './test.json'
const data = Object.values(props.initialData.data)

const activeStep = ref(data[0].id)
const formData = ref({})
const isSubmitted = ref(false)
const errors = ref({})
const maxUnlockedStep = ref(1)

const currentStep = computed(() => {
  return data.find((step) => step.id === activeStep.value)
})

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

const isValidPhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  return re.test(String(phone))
}

const validators = {
  email: isValidEmail,
  tel: isValidPhone,
}

const errorMessages = {
  email: 'Введите корректный email',
  tel: 'Введите корректный номер телефона',
}

const groupedFieldTypes = ['checkbox', 'radio']

const validateCurrentStep = () => {
  let isValid = true
  errors.value = {}

  for (const question of currentStep.value.questions) {
    const fieldType = question.fields[0]?.type

    if (groupedFieldTypes.includes(fieldType)) {
      const isAnyChecked = question.fields.some((field) => formData.value[field.name])

      if (!isAnyChecked) {
        for (const field of question.fields) {
          errors.value[field.name] = 'Выберите хотя бы один вариант'
        }
        isValid = false
      }
    } else {
      for (const field of question.fields) {
        const value = formData.value[field.name]

        if (!value) {
          errors.value[field.name] = 'Это поле обязательно для заполнения'
          isValid = false
          continue // Если поле пустое, дальше форматы не проверяем, идем к следующему полю
        }

        if (validators[field.type]) {
          const isFieldValid = validators[field.type](value)

          if (!isFieldValid) {
            errors.value[field.name] = errorMessages[field.type]
            isValid = false
          }
        }
      }
    }
  }

  return isValid
}

const setStep = (stepId) => {
  if (stepId < activeStep.value) {
    errors.value = {}
    activeStep.value = stepId
    return
  }

  if (stepId > activeStep.value) {
    const isValid = validateCurrentStep()

    if (isValid) {
      if (activeStep.value >= maxUnlockedStep.value) {
        maxUnlockedStep.value = activeStep.value + 1
      }

      if (stepId <= maxUnlockedStep.value) {
        activeStep.value = stepId
      } else {
        activeStep.value = maxUnlockedStep.value
      }
    }
  }
}

const scrollContainer = ref(null)

const scrollToTop = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

const validateHandleData = () => {
  const isValid = validateCurrentStep()

  if (isValid) {
    if (activeStep.value >= maxUnlockedStep.value) {
      maxUnlockedStep.value = activeStep.value + 1
    }

    console.log(`Данные успешно собраны после шага ${activeStep.value}:`, formData.value)

    if (activeStep.value === data.length) {
      console.log('Данные готовы к отправке на сервер!', formData.value)
      isSubmitted.value = true
    } else {
      activeStep.value++
      scrollToTop()
    }
  }
}
</script>

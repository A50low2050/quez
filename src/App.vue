<template>
  <main class="main vh-100 w-100 d-block">
    <div class="container-wrapper d-lg-flex align-items-center h-100">
      <div
        class="form-wrapper bg-white w-100 d-flex flex-column flex-lg-row p-0 p-lg-4 shadow-sm rounded-4 overflow-hidden"
      >
        <SidebarNav
          :current-step="activeStep"
          :max-unlocked-step="maxUnlockedStep"
          :data="data"
          @change-step="setStep"
        />

        <form
          v-if="!isSubmitted"
          class="form-main flex-grow-1 d-flex flex-column justify-content-between"
        >
          <div
            ref="scrollContainer"
            class="form-info px-4 py-4 flex-grow-1"
            style="overflow-y: auto"
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
            class="text-end mt-5 px-3 px-lg-0 bg-white py-3 py-lg-0 d-flex justify-content-between align-items-center pt-3"
          >
            <FormButtonBack v-if="activeStep > 1" @click.prevent="activeStep--">
              {{ initialData.buttons.GoBack }}
            </FormButtonBack>

            <FormButtonNext class="ms-auto" @click.prevent="validateHandleData">
              {{
                activeStep === data.length ? initialData.buttons.Confirm : initialData.buttons.Next
              }}
            </FormButtonNext>
          </div>
        </form>

        <SuccessSumbitForm v-else class="flex-grow-1" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import SidebarNav from '@/components/navbar/SidebarNav.vue'
import StepPersonalInfo from './components/forms/StepPersonalInfo.vue'
import SuccessSumbitForm from './components/forms/SuccessSumbitForm.vue'

import FormButtonNext from '@/ui/FormButtonNext.vue'
import FormButtonBack from '@/ui/FormButtonNext.vue'

const props = defineProps({
  initialData: {
    type: [String, Object],
    default: () => ({}),
  },
})

const data = Object.values(props.initialData.config.data)

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
  const re = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/
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
  if (activeStep.value !== data[0].id) {
    errors.value = {}
    return true
  }

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
          continue
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

const sendYandexMetric = (stepNumber) => {
  if (typeof ym === 'function') {
    ym(45848664, 'reachGoal', `step_${stepNumber}`)
  } else {
    console.warn('Метрика ещё не загружена')
  }
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
      activeStep.value = stepId

      if (stepId > maxUnlockedStep.value) {
        maxUnlockedStep.value = stepId
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
  })
}

const validateHandleData = () => {
  const isValid = validateCurrentStep()

  if (isValid) {
    const currentStepNumber = activeStep.value

    if (typeof BX !== 'undefined') {
      BX.ajax({
        url: '/ajax/testForm.php',
        method: 'POST',
        data: formData.value,
        onsuccess: function (data) {
          const response = JSON.parse(data)
          if (response.success) {
            const InfoMetric = sendYandexMetric(currentStepNumber)
            console.log(InfoMetric)
          }
        },
        onfailure: function () {
          console.log('error')
        },
      })
    }

    if (activeStep.value >= maxUnlockedStep.value) {
      maxUnlockedStep.value = activeStep.value + 1
    }

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

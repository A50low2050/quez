<template>
  <Teleport to="#app">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div
        class="form-wrapper bg-white rounded-4 shadow-lg d-flex flex-column flex-lg-row p-0 p-lg-4 position-relative overflow-hidden"
      >
        <button
          type="button"
          class="btn-step-close position-absolute top-0 end-0 m-3 m-lg-4 z-3"
          @click="$emit('close')"
          aria-label="Close"
        >
          X
        </button>

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
            class="text-end px-3 px-lg-0 bg-white py-3 py-lg-0 d-flex justify-content-between align-items-center border-top"
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
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import SidebarNav from '@/components/navbar/SidebarNav.vue'
import StepPersonalInfo from '../forms/StepPersonalInfo.vue'
import SuccessSumbitForm from '../forms/SuccessSumbitForm.vue'

import FormButtonNext from '@/ui/FormButtonNext.vue'
import FormButtonBack from '@/ui/FormButtonNext.vue'

const props = defineProps({
  initialData: {
    type: [String, Object],
    default: () => ({}),
  },
})

defineEmits(['close'])

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
  })
}

const validateHandleData = () => {
  const isValid = validateCurrentStep()

  //   BX.ajax({
  //     // файл на который идет запрос
  //     url: '/ajax/testForm.php',
  //     // метод запроса GET/POST
  //     method: 'POST',
  //     // параметры передаваемый запросом
  //     data: formData.value,

  //     // ответ сервера лежит в data
  //     onsuccess: function (data) {
  //       console.log(data)
  //     },
  //     // выполнится в случае ошибки
  //     onfailure: function () {
  //       console.log('error')
  //     },
  //   })
  //   console.log('Данные!', formData.value)

  if (isValid) {
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

// onMounted(() => {
//   document.body.style.overflow = 'hidden'
// })

// onBeforeUnmount(() => {
//   document.body.style.overflow = ''
// })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999 !important;
  padding: 1rem;
}

.form-wrapper {
  max-width: 1100px;
  width: 100%;
  height: 85vh;
  animation: modal-fade-in 0.3s ease-out;
}

.btn-step-close {
  background: none;
  border: none;
  padding: 0;
  font-size: 1.5rem;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Анимация появления */
@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

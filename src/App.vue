<template>
  <main class="vh-100 w-100 d-flex justify-content-center align-items-center">
    <button
      class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow fw-bold"
      @click="isActionModalOpen = true"
    >
      {{ initialData.buttons.StartSurvey }}
    </button>

    <ActionModal
      v-if="isActionModalOpen"
      :initial-data="initialData"
      @close="isActionModalOpen = false"
      @start-survey="openSurvey"
      @download="handleDownload"
    />

    <FeedbackModal
      v-if="isFeedbackModalOpen"
      :initial-data="initialData"
      @close="isFeedbackModalOpen = false"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ActionModal from './components/modalWindow/ActionModal.vue'
import FeedbackModal from './components/modalWindow/FeedbackModal.vue'

const isActionModalOpen = ref(false)
const isFeedbackModalOpen = ref(false)

const openSurvey = () => {
  isActionModalOpen.value = false
  isFeedbackModalOpen.value = true
}

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({ config: {}, buttons: {} }),
  },
})

const handleDownload = async () => {
  const fileUrl = props.initialData.buttons.url
  const fileName = 'Опросник'

  try {
    const response = await fetch(fileUrl)

    if (!response.ok) {
      throw new Error('Ошибка при загрузке файла')
    }

    const blob = await response.blob()

    const downloadUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(downloadUrl)

    console.log('Файл успешно скачан!')
  } catch (error) {
    console.error('Не удалось скачать файл:', error)
    alert('Произошла ошибка при скачивании файла. Пожалуйста, попробуйте позже.')
  }
}
</script>

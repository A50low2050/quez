<template>
  <Teleport to="#app">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div
        class="action-wrapper bg-white rounded-4 shadow-lg p-4 p-lg-5 position-relative text-center"
      >
        <button
          type="button"
          class="btn-step-close position-absolute top-0 end-0 m-3 z-3"
          @click="$emit('close')"
          aria-label="Close"
        >
          &#10005;
        </button>

        <h3 class="mb-4 fw-bold">Выберите действие</h3>
        <p class="text-muted mb-4"></p>

        <div class="d-flex flex-column gap-3">
          <button
            class="btn btn-primary btn-lg py-3 rounded-pill fw-bold"
            @click="$emit('startSurvey')"
          >
            {{ initialData.buttons.TakeSurvey }}
          </button>

          <button
            class="btn btn-outline-secondary btn-lg py-3 rounded-pill fw-bold"
            @click="$emit('download')"
          >
            {{ initialData.buttons.Download }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  initialData: {
    type: Object,
    default: () => ({ config: {}, buttons: {} }),
  },
})

defineEmits(['close', 'startSurvey', 'download'])
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
  z-index: 9999;
  padding: 1rem;
}

.action-wrapper {
  max-width: 500px;
  width: 100%;
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

.btn-step-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

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

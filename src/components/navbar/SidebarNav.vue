<template>
  <nav class="nav sidebar p-lg-3 p-xl-4 flex-shrink-0">
    <ul class="navbar-nav d-flex flex-row flex-lg-column p-2 mx-auto mt-5 mx-lg-0 mt-lg-0">
      <li v-for="step in data" :key="step.id" class="nav-item mb-3">
        <a
          class="nav-link align-items-center d-flex"
          :class="{ active: currentStep === step.id }"
          aria-current="page"
          href="#"
          @click.prevent="$emit('changeStep', step.id)"
        >
          <div
            class="step-count flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border border-2 me-4"
          >
            <h6 class="count-number mb-0 text-white">{{ step.id }}</h6>
          </div>
          <div class="step-info d-none d-lg-block">
            <h6 class="text-uppercase fw-normal mb-1 step-number text-white opacity-50">
              Шаг {{ step.id }}
            </h6>
            <h6 class="step-count-title text-uppercase text-white mb-0">
              {{ step.title }}
            </h6>
          </div>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
  data: {
    type: Array,
    required: true,
  },
})

defineEmits(['changeStep'])
</script>

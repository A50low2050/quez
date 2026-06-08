// composables/useFormValidation.js
import { ref} from 'vue'

export function useFormValidation(initialValues, validationRules) {
  // Reactive form data
  const formData = ref({ ...initialValues })
  
  // Error messages for each field
  const errors = ref({})
  
  // Border styles for each field (optional, but can be used for dynamic classes)
  const fieldStatus = ref({})

  // Validate a single field
  const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName]
    if (!rule) return true
    
    let isValid = true
    let errorMessage = ''
    
    if (rule.required && !value) {
      isValid = false
      errorMessage = rule.message || 'This field is required'
    }
    // Add more rules (email format, min length, etc.)
    else if (rule.pattern && !rule.pattern.test(value)) {
      isValid = false
      errorMessage = rule.message || 'Invalid format'
    }
    
    errors.value[fieldName] = isValid ? '' : errorMessage
    fieldStatus.value[fieldName] = isValid ? 'valid' : 'error'
    return isValid
  }

  // Validate all fields
  const validateAll = () => {
    let allValid = true
    Object.keys(validationRules).forEach(field => {
      const valid = validateField(field, formData.value[field])
      if (!valid) allValid = false
    })
    return allValid
  }

  // Watch for changes (optional – can also call validateField on input/blur)
  const onBlur = (fieldName) => {
    validateField(fieldName, formData.value[fieldName])
  }

  const onInput = (fieldName) => {
    // Clear error while typing (optional)
    if (errors.value[fieldName]) {
      errors.value[fieldName] = ''
      fieldStatus.value[fieldName] = 'valid'
    }
  }

  return {
    formData,
    errors,
    fieldStatus,
    validateField,
    validateAll,
    onBlur,
    onInput
  }
}
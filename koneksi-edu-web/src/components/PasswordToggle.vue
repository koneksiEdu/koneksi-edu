<template>
  <span
    class="password-toggle"
    @click="togglePasswordVisibility"
  >
    <i v-if="showPassword" class="bi bi-eye-slash"></i>
    <i v-else class="bi bi-eye"></i>
  </span>
</template>
  
<script>
export default {
  name: 'PasswordToggle',
  props: {
    showPassword: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const togglePasswordVisibility = () => {
      emit('toggle');
    };

    return {
      togglePasswordVisibility,
    };
  },
};
</script>

<style scoped>
.password-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  cursor: pointer;
}
</style>
  
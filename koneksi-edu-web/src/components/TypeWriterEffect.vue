<template>
  <div ref="typewriter"></div>
</template>

<script>
import { ref, watch } from 'vue';
import Typewriter from 'typewriter-effect/dist/core';

export default {
  name: 'TypewriterComponent',
  props: {
    text: {
      type: String,
      required: true
    },
    loop: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    const typewriter = ref(null);

    // Membuat watcher untuk memantau perubahan pada properti 'text'
    watch(() => props.text, (newText, oldText) => {
      // Hapus teks sebelumnya
      if (typewriter.value) {
        typewriter.value.innerHTML = '';
      }

      // Buat instance Typewriter baru
      const typewriterInstance = new Typewriter(typewriter.value, {
        loop: props.loop,
        delay: props.delay,
        html: true
      });

      // Ketik teks baru
      typewriterInstance.typeString(newText).start();
    });

    return {
      typewriter,
    };
  },
};
</script>

<style>
.Typewriter__cursor {
  display: none;
}
</style>

<template>
  <div ref="typewriter"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Typewriter from 'typewriter-effect/dist/core';

export default {
  name: 'TypewriterComponent',
  props: {
    text: {
      type: Array,
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

    onMounted(() => {
      const typewriterInstance = new Typewriter(typewriter.value, {
        loop: props.loop,
        delay: props.delay,
        deleteSpeed: props.deleteSpeed,
        html: true
      });

      props.text.forEach((str, index) => {
        typewriterInstance.typeString(str)
          .pauseFor(props.pauseFor);
        if (index < props.text.length - 1) {
          typewriterInstance.deleteAll();
        }
      });

      typewriterInstance.start();
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
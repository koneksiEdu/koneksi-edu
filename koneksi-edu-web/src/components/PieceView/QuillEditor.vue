<template>
	<div ref="quillContainer" class="quill-container"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
	name: 'QuillEditor',
	emits: ['update:content'],
	props: {
		content: {
			type: String,
			default: ''
		}
	},
	setup(props, { emit }) {
		const quillContainer = ref(null);
		let quill;
    const toolbarOptions = [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]

		onMounted(() => {
			quill = new Quill(quillContainer.value, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });
			quill.root.innerHTML = props.content;

			quill.on('text-change', () => {
				emit('update:content', quill.root.innerHTML);
			});
		});

		onBeforeUnmount(() => {
			quill = null;
		});

		return {
			quillContainer
		};
	}
};
</script>

<style scoped>
.quill-container {
	height: 300px;
}
</style>

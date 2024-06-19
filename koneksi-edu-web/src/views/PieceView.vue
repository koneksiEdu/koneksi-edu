<template>
  <div class="min-h-screen bg-gradient-to-r from-white to-sky-100">
    <main class="w-full">
      <h1 class="font-bold text-2xl py-1 text-center px-2 text-blue-800">Piece</h1>
      <div class="max-w-4xl mx-auto p-2">
        <div class="border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue">
          <p class="text-white">
            Halaman ini (mungkin) bisa diakses siapa saja, tetapi siapa saja belum tentu bisa menggunakan halaman ini
          </p>
        </div>
        <div class="max-w-4xl mx-auto p-4">
          <h1 class="text-3xl font-bold mb-4">Tambahkan Piece</h1>
          <input
            v-model="title"
            placeholder="Judul"
            class="w-full p-2 mb-4 border rounded"
          />
          <select v-model="category" class="w-full p-2 mb-4 border rounded">
            <option value="" disabled>Pilih Kategori</option>
            <option value="Web">Pembuatan dan Pengelolaan Web</option>
            <option value="SEO">Optimasi Mesin Pencari (SEO)</option>
            <option value="Sosmed">Manajemen Media Sosial</option>
            <option value="Marketing">Pemasaran Digital</option>
            <option value="Design">Branding dan Design Grafis</option>
          </select>
          <QuillEditor v-model:content="content" :options="editorOptions" class="mb-4" />
          <div class="flex mt-4 space-x-2">
            <button @click="createPost" class="bg-blue-500 text-white px-4 py-2 rounded">
              Create Post
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QuillEditor from '@/components/PieceView/QuillEditor.vue';
import { supabase } from '@/lib/supabaseClient';

const title = ref('');
const category = ref('');
const content = ref('');

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'align': [] }],
      ['image'],
      ['clean']
    ]
  }
}; 

const createPost = async () => {
  const { data, error } = await supabase.from('posts').insert([
    {
      title: title.value,
      category: category.value,
      content: content.value,
      isactive: false,
    }
  ]);
  if (error) {
    console.error(error);
  } else {
    alert('Post created successfully!');
    resetForm();
  }
};

const resetForm = () => {
  title.value = '';
  category.value = '';
  content.value = '';
};

</script>
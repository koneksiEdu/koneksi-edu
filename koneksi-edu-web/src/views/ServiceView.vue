<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100">
    <NavPartial />
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <h1 class="font-bold text-2xl py-1 ml-2 px-2 text-blue-800">Jasa</h1>
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/4 p-4 md:p-2">
            <h2 class="font-semibold mb-2 text-center text-blue-700">Kategori</h2>
            <div class="grid grid-cols-2 md:flex md:flex-col gap-2">
              <button
                v-for="category in categories"
                :key="category.category"
                @click="selectedCategory = category"
                :class="{'bg-blue-500 text-white': selectedCategory.category === category.category, 'bg-white shadow-md text-blue-500': selectedCategory.category !== category.category}"
                class="px-4 py-2 rounded-lg focus:outline-none">
                {{ category.name }}
              </button>
            </div>
          </div>
          <div class="md:block mb-4 md:mb-0 flex justify-center md:w-3/4 p-4">
            <div class="border p-4 bg-white rounded-lg shadow flex flex-col justify-between" style="width: 100%; max-width: 288px; height: 572px; background: url('/ppob-vn/office1.png') no-repeat center center; background-size: cover;">
              <div class="overflow-y-auto hidden-scrollbar" style="height: 50%;">
                <div v-for="post in filteredPosts" :key="post.id" class="relative border p-2 mb-4 bg-white w-full rounded shadow animate__animated animate__fadeIn" @click="openModal(post)">
                  <h3 class="font-bold text-left mb-2">{{ post.title }}</h3>
                </div>
              </div>
              <div class="flex items-center bg-opacity-80 bg-blue-100 rounded-md p-2">
                <img src="/ppob-vn/girl1.png" alt="Portrait" class="animate__animated animate__flipInY w-12 h-12 rounded-full mr-2">
                <div @click="showAllText" class="cursor-pointer">
                  <div class="font-semibold mb-1 text-red-400">Customer Support</div>
                  <div class="p-2 text-sm bg-white text-blue-900 font-semibold rounded-lg">
                    <TypewriterComponent v-if="isTypeNotEnd" ref="typewriter" :text="dialogText" />
                    <p v-else>Dikarenakan harga bisa bersifat dinamis menyesuaikan dengan kebutuhan, pemesanan jasa akan diarahkan ke admin terlebih dahulu untuk konsultasi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white mx-2 my-4 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h2 class="text-xl text-blue-800 font-bold mb-4">{{ selectedPost.title }}</h2>
        <div class="mb-4 text-blue-800" v-html="selectedPost.content"></div>
        <div class="flex justify-end">
          <button @click="contactAdmin(selectedPost.title)" class="bg-blue-500 font-semibold text-white px-4 py-2 rounded-lg">Hubungi Admin</button>
          <button @click="closeModal" class="bg-blue-800 text-blue-200 font-semibold px-4 py-2 rounded-lg ml-2">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavPartial from '@/components/NavPartial.vue';
import { supabase } from '@/lib/supabaseClient';
import TypewriterComponent from '@/components/TypeWriterEffect.vue';

const categories = ref([
  { name: 'Website', category: 'Web' },
  { name: 'SEO', category: 'SEO' },
  { name: 'Manajemen Sosmed', category: 'Sosmed' },
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'Branding & Desain', category: 'Design' },
]);

const dialogText = ref('');

const selectedCategory = ref(categories.value[0]);
const posts = ref([]);
const selectedPost = ref(null);
const isModalOpen = ref(false);
const isTypeNotEnd = ref(true);

const fetchPosts = async () => {
  dialogText.value = 'Dikarenakan harga bisa bersifat dinamis menyesuaikan dengan kebutuhan, pemesanan jasa akan diarahkan ke admin terlebih dahulu untuk konsultasi';
  const { data, error } = await supabase.from('posts').select('*');
  if (error) console.error(error);
  else posts.value = data;
};

onMounted(fetchPosts);

const filteredPosts = computed(() => {
  return posts.value.filter(post => post.category === selectedCategory.value.category);
});

const openModal = (post) => {
  selectedPost.value = post;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const contactAdmin = (title) => {
  const text = `Min! saya tertarik dengan ${title}`;
  const urlencoded = encodeURI(text);
  window.location.href = `https://wa.me/6281347010085?text=${urlencoded}`;
};

const showAllText = () => {
  isTypeNotEnd.value = false;
};
</script>

<style scoped>
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

.hidden-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

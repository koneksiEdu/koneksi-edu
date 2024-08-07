<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100">
    <NavPartial />
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <h1 class="font-bold text-2xl py-1 ml-2 px-2 text-blue-800">Kios</h1>
        <div v-if="!isActive" class="border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
          <p class="text-white">
            Kios belum aktif, silahkan klik <span @click="toggleIsActive(true)" class="bg-white px-1 font-semibold text-blue-700 cursor-pointer">link berikut</span> untuk mengaktifkan fitur kios. 
          </p>
        </div>
        <div v-else class="border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
          <p class="text-white">
          Kios aktif, silahkan klik <span @click="toggleIsActive(false)" class="bg-white px-1 font-semibold text-blue-700 cursor-pointer">link berikut</span> untuk menonaktifkan fitur kios.
          </p>
        </div>
        <div v-if="isActive">
          <div class="mt-4 border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
            <p class="text-white">
              Untuk mendapatkan chat id wajib menggunakan <a class="bg-white px-1 font-semibold text-blue-700 cursor-pointer" target="_blank" href="https://t.me/topikselbot">telegrambot ini</a> dengan mengetik pesan <span class="bg-white px-1 font-semibold text-blue-700 cursor-pointer">/chatid</span>, respon chat mungkin lama, mohon bersabar (sekitar 1 - 3 menit), tenang untuk pemberitahuan pesanan delay hanya sekitar 5 detik.
            </p>
          </div>
          <form @submit.prevent="changePhone">
            <label for="phone" class="mt-4 block mb-2 text-blue-800">Chat Id</label>
            <input 
              v-model.number="form.phone" 
              id="phone" 
              name="phone" 
              class="mt-1 w-64 text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-blue-400 outline outline-gray-400" 
              type="text"
              required
            />  
            <button type="submit" class="ml-1 bg-blue-400 text-white p-2 rounded-md">Ubah</button>
          </form>
          <!-- Modal Form -->
          <InsertProductModal ref="productFormModal" @closeModal="closeModal" :showModal="showModal" @productAdded="fetchProducts" />

          <!-- Product List -->
          <ProductList ref="productModal" :products="products" @productDeleted="handleProductDeleted" />

          <div class="fixed bottom-10 right-10">
            <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah Product
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavPartial from '@/components/NavPartial.vue';
import InsertProductModal from '@/components/KiosView/InsertProductModal.vue';
import ProductList from '@/components/KiosView/ProductList.vue';
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/stores/stores';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'

const router = useRouter();
const authStore = useAuthStore();

const products = ref([]);
const uid = ref(null);
const username = ref(null);
const isActive = ref(false);
const showModal = ref(false);
const productModal = ref(null)
const productFormModal = ref(null)
const form = ref({
  phone: '',
});

watch(() => authStore.currentUser, async (newVal) => {
  if (newVal) {
    uid.value = newVal.id;
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid.value)
        .single();
      if (profileError) {
        throw profileError;
      }
      username.value = profile.username;
      isActive.value = profile.kios_status
      if (profile.chat_id){
        form.value.phone = profile.chat_id
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  } else {
    router.push({ name: 'login' });
  }
}, { immediate: true });

const fetchProducts = async () => {
  productModal.value.fetchProducts()
};

const changePhone = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ chat_id: form.value.phone })
      .eq('id', uid.value);
    if (error) {
      throw error;
    }
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        title: 'text-blue-800 font-light',
        timerProgressBar: 'bg-blue-800',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    Toast.fire({
      title: 'Nomor HP berhasil diubah!'
    })
  } catch (error) {
    console.error("Error updating phone number:", error);
  }
};

const handleProductDeleted = (productId) => {
  products.value = products.value.filter(product => product.id !== productId);
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  productFormModal.value.form = {
    title: '',
    image_url: '',
    price: '',
    desc: '',
    is_active: false
  };
};

const toggleIsActive = async (status) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ kios_status: status })
      .eq('id', uid.value);
    if (error) throw error;
    isActive.value = status;
  } catch (error) {
    console.error("Error updating is_active status:", error);
  }
};

</script>

<style scoped>
/* No custom styles needed as per Tailwind CSS usage */
</style>
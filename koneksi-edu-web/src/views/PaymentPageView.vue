<template>
  <div class="flex justify-center min-h-screen bg-gray-100 py-6">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 class="text-blue-400 text-2xl font-semibold mb-4">Pembayaran</h2>
      <form @submit.prevent="submitPayment">
        <div class="mb-4">
          <label for="nama" class="block text-blue-400 font-bold mb-2">Nama</label>
          <input
            type="text"
            id="nama"
            v-model="nama"
            @blur="validateNama"
            class="text-blue-700 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.nama" class="text-blue-800 text-sm mt-1">{{ errors.nama }}</p>
        </div>
        <div class="mb-4">
          <label for="alamat" class="block text-blue-400 font-bold mb-2">Alamat</label>
          <input
            type="text"
            id="alamat"
            v-model="alamat"
            @blur="validateAlamat"
            class="text-blue-700 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.alamat" class="text-blue-800 text-sm mt-1">{{ errors.alamat }}</p>
        </div>
        <div class="mb-4">
          <label for="keterangan" class="block text-blue-400 font-bold mb-2">Keterangan Tambahan</label>
          <textarea
            id="keterangan"
            v-model="keterangan"
            class="text-blue-700 resize-vertical w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div class="mb-6">
          <h3 class="text-blue-400 text-xl font-semibold mb-2">Informasi Item</h3>
          <ul>
            <li v-for="(item, index) in cartItems" :key="index" class="flex text-blue-400 font-semibold justify-between items-center bg-gray-200 p-2 rounded-lg mb-2">
              <span>{{ item.judul }} x {{ item.jumlah }}</span>
              <span>{{ item.harga }}</span>
            </li>
          </ul>
          <div class="flex justify-between items-center mt-4">
            <span class="text-lg text-blue-800 font-semibold">Total: {{ totalPrice }}</span>
          </div>
        </div>
        <button type="submit" class="bg-blue-800 text-white px-4 py-2 rounded-lg">
          Beli
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';

const route = useRoute();
const username = ref(route.params.id);

const nama = ref('');
const alamat = ref('');
const keterangan = ref('');
const cartItems = ref([]);
const totalPrice = ref(0);
const errors = ref({ nama: '', alamat: '' });
const phone = ref("")

onMounted( async () =>  {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.value)
      .single();
    if (profileError) {
      throw profileError;
    }
    phone.value = profile.chat_id
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
});

const validateNama = () => {
  errors.value.nama = !nama.value ? 'Nama harus diisi' : '';
};

const validateAlamat = () => {
  errors.value.alamat = !alamat.value ? 'Alamat harus diisi' : '';
};

const getCartData = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
  cartItems.value = storedCart[username.value]?.barang || [];
  totalPrice.value = cartItems.value.reduce((total, item) => total + item.harga * item.jumlah, 0);
};

const submitPayment = () => {
  validateNama();
  validateAlamat();

  if (!nama.value || !alamat.value) {
    return;
  }

  const itemsDescription = cartItems.value
    .map(item => `${item.judul} x ${item.jumlah} - ${item.harga}`)
    .join(', ');

  const message = `
    Nama: ${nama.value}
    Alamat: ${alamat.value}
    Keterangan: ${keterangan.value}
    Item: ${itemsDescription}
    Total: ${totalPrice.value}
  `;

  const whatsappUrl = `https://wa.me/62${phone.value}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

onMounted(() => {
  getCartData();
});
</script>

<style scoped>
/* Add any necessary scoped styles */
</style>
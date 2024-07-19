<template>
  <div>
    <h2 class="font-bold text-blue-800 text-lg my-4">Daftar Produk</h2>
    <div v-if="products.length === 0" class="text-blue-500">Tidak ada produk yang ditambahkan.</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="product in products" :key="product.id" class="animate__animated animate__bounceIn relative border border-gray-200 rounded-md overflow-hidden">
          <!-- Product Image -->
          <div class="w-full h-64 flex items-center justify-center">
            <img :src="product.image_url" alt="Product Image" class="object-cover max-w-full max-h-full">
          </div>

          <!-- Overlay with Product Title -->
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center opacity-0 hover:opacity-100 transition-opacity">
            <h3 class="font-semibold text-lg">{{ product.title }}</h3>
          </div>

          <!-- Buttons -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-gray-300 bg-opacity-75">
            <button @click="openEditModal(product)" class="bg-blue-400 text-white p-1 font-semibold rounded-md"><i class="bi bi-pencil"></i></button>
            <button @click="showDeleteModal(product.id)" class="bg-blue-400 text-white p-1 font-semibold rounded-md"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
    <InsertProductModal :showModal="showModal" :editProduct="editProduct" @closeModal="closeModal"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import Swal from 'sweetalert2';
import InsertProductModal from './InsertProductModal.vue';
import { useAuthStore } from '@/stores/stores';

const products = ref([]);
const showModal = ref(false);
const editProduct = ref(null);
const authStore = useAuthStore();

const fetchProducts = async () => {
  const dataku = authStore.currentUser
  try {
    const { data, error } = await supabase
      .from('kios_products')
      .select('*')
      .eq("user_id", dataku.id)

    if (error) throw error;
    products.value = data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const openEditModal = (product) => {
  editProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editProduct.value = null;
};

const showDeleteModal = (id) => {
  Swal.fire({
    title: 'Konfirmasi Hapus',
    html: '<span class="text-blue-600">Apakah Anda yakin ingin menghapus produk ini?</span>',
    icon: 'warning',
    iconColor: "#3b82f6",
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#1e40af',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    customClass: {
        title: 'text-blue-700',
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProduct(id);
    }
  });
};

const deleteProduct = async (productId) => {
  try {
    const { error } = await supabase
      .from('kios_products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

defineExpose({fetchProducts})
fetchProducts();
</script>

<style scoped>
/* Optional styling for the product cards */
</style>
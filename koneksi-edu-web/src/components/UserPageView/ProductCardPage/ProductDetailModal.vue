<template>
  <div v-if="isOpen" class="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-60 w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl text-blue-400 font-bold">{{ product.title }}</h2>
        <button @click="closeModal" class="text-gray-600 hover:text-gray-900">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <img class="w-full mb-4" :src="product.image_url" :alt="product.title">
      <p class="text-blue-400 mb-4">{{ product.desc }}</p>
      <p class="bg-gray-200 p-1 rounded-md text-blue-400 mb-4">{{ formattedPrice }}</p>
      <div class="flex items-center text-blue-400 mb-4">
        <label for="quantity" class="mr-2">Jumlah:</label>
        <input type="number" v-model.number="quantity" id="quantity" min="1" class="border rounded p-1 w-20">
      </div>
      <button @click="addToCart" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        <i class="bi bi-cart-plus-fill"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

export default defineComponent({
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const quantity = ref(1);
    const route = useRoute();
    const username = ref(route.params.id);

    const formattedPrice = computed(() => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(props.product.price);
    });

    const closeModal = () => {
      emit('close');
    };

    const showErrorModal = () => {
      Swal.fire({
        title: 'Error',
        html: '<span class="text-blue-600">Jumlah barang harus lebih dari 0</span>',
        icon: 'error',
        iconColor: "#3b82f6",
        showCancelButton: false,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#1e40af',
        confirmButtonText: 'Ok',
        customClass: {
            title: 'text-blue-700',
        }
      });
    };

    const addToCart = () => {
      if (quantity.value < 1) {
        // Menampilkan pesan atau tindakan lainnya jika jumlah kurang dari 1
        showErrorModal()
        return;
      }

      const cart = JSON.parse(localStorage.getItem('cart')) || {};
      if (!cart[username.value]) {
        cart[username.value] = { barang: [] };
      }
      
      const existingProduct = cart[username.value].barang.find(item => item.id === props.product.id);
      
      if (existingProduct) {
        existingProduct.jumlah += quantity.value;
      } else {
        cart[username.value].barang.push({
          id: props.product.id,
          judul: props.product.title,
          jumlah: quantity.value,
          harga: props.product.price
        })
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      emit('productAdded');
      closeModal();
    };

    return {
      quantity,
      formattedPrice,
      closeModal,
      addToCart,
    };
  }
});
</script>

<style scoped>
.fixed {
  overflow-y: auto;
}
</style>
<template>
  <div v-if="isOpen" class="z-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-60 w-full max-h-[70vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl text-blue-400 font-semibold">Keranjang</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div v-if="cartItems.length > 0" class="cart-items space-y-4">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item bg-gray-100 p-4 rounded-lg shadow-md animate__animated animate__fadeIn">
          <div class="item-info mb-2">
            <h3 class="text-md text-blue-400 font-semibold">{{ item.judul }}</h3>
            <p class="text-gray-700">{{ item.harga }} x {{ item.jumlah }}</p>
          </div>
          <div class="item-controls flex items-center justify-between">
            <div class="shadow-md flex rounded=md bg-gray-300 items-center space-x-2">
              <button @click="decrementItem(index)" class="bg-blue-700 font-bold text-white rounded-md w-8 h-8 flex items-center justify-center focus:outline-none">
                <
              </button>
              <span class="text-blue-400">{{ item.jumlah }}</span>
              <button @click="incrementItem(index)" class="bg-blue-700 font-bold text-white rounded-md w-8 h-8 flex items-center justify-center focus:outline-none">
                >
              </button>
            </div>
            <button @click="removeItem(index)" class="bg-blue-500 text-white rounded-md w-8 h-8 flex items-center justify-center focus:outline-none">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="cart-total mt-6 flex flex-col items-center">
          <h3 class="text-xl text-center font-semibold">Total: {{ totalPrice }}</h3>
          <button @click="checkout" class="bg-blue-500 mt-2 text-white px-4 py-2 rounded-lg focus:outline-none animate__animated animate__pulse">
            Checkout
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">Keranjang kosong</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'CheckoutPage',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const username = ref(route.params.id);
    const cartItems = ref([]);

    const loadCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || {};
      if (cart[username.value] && cart[username.value].barang) {
        cartItems.value = cart[username.value].barang;
      }
    };

    watchEffect(() => {
      loadCartItems();
    });

    const saveCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || {};
      if (!cart[username.value]) {
        cart[username.value] = { barang: [] };
      }
      cart[username.value].barang = cartItems.value;
      localStorage.setItem('cart', JSON.stringify(cart));
    };

    const incrementItem = (index) => {
      cartItems.value[index].jumlah += 1;
      saveCartItems();
    };

    const decrementItem = (index) => {
      if (cartItems.value[index].jumlah > 1) {
        cartItems.value[index].jumlah -= 1;
        saveCartItems();
      }
    };

    const removeItem = (index) => {
      cartItems.value.splice(index, 1);
      saveCartItems();
      emit('updateNewCart')
    };

    const checkout = () => {
      saveCartItems();
      // Logika untuk checkout, misalnya mengarahkan ke halaman pembayaran
      router.push({ name: `paymentPage`, params: {id: username.value} });
    };

    const totalPrice = computed(() => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(cartItems.value.reduce((total, item) => total + item.harga * item.jumlah, 0));
    });

    const closeModal = () => {
      emit('close');
    };

    return {
      cartItems,
      incrementItem,
      decrementItem,
      removeItem,
      totalPrice,
      checkout,
      closeModal
    };
  }
};
</script>

<style scoped>
.fixed {
  overflow-y: auto;
}
</style>
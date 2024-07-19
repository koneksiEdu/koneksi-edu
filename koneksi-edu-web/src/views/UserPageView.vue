<template>
  <div class="flex justify-center min-h-screen bg-gradient-to-r from-pink-500 py-2 to-yellow-500">
    <div class="bg-white p-2 rounded-lg shadow-md max-w-xs h-[672px] bg-opacity-75 w-full my-auto mx-4 flex flex-col justify-between">
    <!-- <div class="bg-white p-2 rounded-lg shadow-md max-w-xs h-[672px] bg-opacity-75 w-full my-auto mx-4 flex flex-col justify-between" :style="{ background: `url('/ppob-vn/office1.png') no-repeat center center`, backgroundSize: 'cover' }"> -->
      <div v-if="errorMsg" class="text-red-500 mb-4">
        {{ errorMsg }}
      </div>
      <div v-else>
        <div class="flex items-center bg-opacity-80 bg-blue-100 rounded-md p-2">
          <img v-if="imgUrl" :src="imgUrl" class="animate__animated animate__flipInY w-12 h-12 rounded-full mr-2" />
          <div class="bio">
            <h1 class="font-semibold mb-1 text-red-400">{{ username }}</h1>
            <div class="text-sm text-blue-900 font-semibold rounded-lg">
              <TypewriterComponent :text="bio" />
            </div>
          </div>
        </div>
        <div v-if="isKioskActive" class="mx-20 my-2 bg-gray-700 rounded-full flex animate__animated animate__fadeIn">
          <button 
            @click="toggleLinkOrKiosk(true)" 
            :class="[
              'flex-1 font-bold py-2 px-4 text-center animate__animated',
              linkOrKiosk ? 'bg-white text-blue-400 rounded-full animate__slideInRight' : 'text-white'
            ]"
          >
            <i class="bi bi-link-45deg"></i>
          </button>
          <button 
            @click="toggleLinkOrKiosk(false)" 
            :class="[
              'flex-1 font-bold py-2 px-4 text-center animate__animated',
              !linkOrKiosk ? 'bg-white text-blue-400 rounded-full animate__slideInLeft' : 'text-white'
            ]"
          >
            <i class="bi bi-bag-heart"></i>
          </button>
        </div>

        <!-- Container untuk CartIcon -->
        <div v-show="!linkOrKiosk" class="z-10 absolute w-24 left-1/2 transform -translate-x-1/2 translate-y-2">
          <div class="bg-white rounded-md shadow-ms flex justify-center items-center mb-4">
            <CartIcon ref="cartIcon" @checkoutTriggered="openCheckoutModal"/>
          </div>
        </div>
        
        <div class="bg-white bg-opacity-50 p-2 rounded-md mt-2 h-[520px] custom-scrollbar">
          <div v-show="linkOrKiosk">
            <LinksPage/>
            <CarousellPage ref="komponenCarousell"/>
            <LocationPage ref="komponenLokasi" />
          </div>
          <div v-show="!linkOrKiosk">
            <div class="mt-10 grid grid-cols-2 gap-4">
              <ProductCard 
                v-for="product in products" 
                :key="product.id" 
                :product="product" 
                @show-detail="openModal" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProductDetailModal 
      v-if="selectedProduct" 
      :isOpen="isModalOpen" 
      :product="selectedProduct"
      @productAdded = "getCartData"
      @close="closeModal"/>
  </div>
  <CheckoutPage v-if="isCartModalOpen" :isOpen="isCartModalOpen" @updateNewCart="getCartData" @close="closeCheckoutModal"/>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';
import LinksPage from '@/components/UserPageView/LinksPage.vue';
import LocationPage from '@/components/UserPageView/LocationPage.vue';
import CarousellPage from '@/components/UserPageView/CarousellPage.vue';
import TypewriterComponent from '@/components/TypeWriterEffect.vue';
import ProductCard from '@/components/UserPageView/ProductCardPage.vue'
import ProductDetailModal from '@/components/UserPageView/ProductCardPage/ProductDetailModal.vue';
import CartIcon from '@/components/UserPageView/CartIconPage.vue'
import CheckoutPage from '@/components/UserPageView/CheckoutPage.vue'

export default {
  components: {
    TypewriterComponent,
    LinksPage,
    LocationPage,
    CarousellPage,
    ProductCard,
    ProductDetailModal,
    CartIcon,
    CheckoutPage
  },
  setup() {
    const route = useRoute();
    const username = ref(route.params.id);
    const imgUrl = ref("");
    const bio = ref("");
    const errorMsg = ref("");
    const komponenLokasi = ref(null);
    const komponenCarousell = ref(null);
    const isKioskActive = ref(null);
    const linkOrKiosk = ref(true);
    const products = ref([]);
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    const cartIcon = ref(null)
    const isCartModalOpen = ref(false);

    const openModal = (product) => {
      selectedProduct.value = product;
      isModalOpen.value = true;
    };

    const openCheckoutModal = () =>{
      isCartModalOpen.value = true;
    }

    const closeCheckoutModal = () => {
      isCartModalOpen.value = false;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedProduct.value = null;
    };

    const getCartData = () => {
      cartIcon.value.updateItemValue()
    };

    const fetchProfile = async (newUsername) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', newUsername)
          .single();
        if (profileError) {
          throw profileError;
        }
        if (!profile) {
          throw new Error("Profile not found");
        }
        if (profile.avatar_url) {
          imgUrl.value = `https://lkyubyoimdryxsrpsbli.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`;
        }
        bio.value = profile.bio;
        isKioskActive.value = profile.kios_status;
        errorMsg.value = "";
      } catch (fetchError) {
        console.error("Error fetching profile:", fetchError);
        errorMsg.value = "Profil tidak ditemukan atau kesalahan terjadi saat mengambil data profil.";
        imgUrl.value = "";
        bio.value = "";
      }
    };

    const fetchProducts = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('kios_products')
          .select('*')
          .eq('username', username.value);
        if (productsError) {
          throw productsError;
        }
        products.value = productsData;
      } catch (fetchError) {
        console.error("Error fetching products:", fetchError);
      }
    };

    const toggleLinkOrKiosk = (status) => {
      linkOrKiosk.value = status;
    };

    onMounted(async () => {
      await fetchProfile(username.value);
      await fetchProducts();
      await nextTick();
      if (komponenLokasi.value) {
        komponenLokasi.value.checkMap(username.value);
      }
      if (komponenCarousell.value) {
        komponenCarousell.value.loadCarousell(username.value);
      }
    });

    return {
      username,
      imgUrl,
      bio,
      errorMsg,
      komponenLokasi,
      komponenCarousell,
      linkOrKiosk,
      toggleLinkOrKiosk,
      isKioskActive,
      products,
      selectedProduct,
      isModalOpen,
      openModal,
      closeModal,
      getCartData,
      cartIcon,
      isCartModalOpen,
      closeCheckoutModal,
      openCheckoutModal
    };
  }
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  -ms-overflow-style: none;
  overflow-y: auto; 
  -webkit-overflow-scrolling: touch; 
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px; 
  height: 5px; 
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); 
  border-radius: 10px;
}
</style>
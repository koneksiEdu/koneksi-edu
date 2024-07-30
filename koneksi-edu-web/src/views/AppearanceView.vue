<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100">
    <NavPartial />
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <h1 class="font-bold text-2xl py-1 ml-2 px-2 text-blue-800">Tampilan</h1>
        <div class="flex justify-center py-6">
          <div class="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <form @submit.prevent="changeUrl">
              <label for="phone" class="block text-center mt-4 mb-2 text-blue-400 font-semibold">Url Gambar Halamanmu</label>
              <input 
                v-model.number="form.url" 
                id="url" 
                name="url" 
                class="mt-1 w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-blue-400 outline outline-gray-400" 
                type="url"
                required
              />  
              <p class="text-sm text-blue-400 my-2">Note: ukuran gambar terbaik 288 px x 572 px atau kelipatan</p>
              <button type="submit" class="font-semibold w-full bg-blue-400 text-white p-2 rounded-md">Ubah Gambar</button>
            </form>
            <h3 class="mt-4 text-blue-400 font-semibold">Warna Background 1</h3>
            <Chrome v-model="colors.bgColor1" class="mt-2" />
            <h3 class="mt-4 text-blue-400 font-semibold">Warna Background 2</h3>
            <Chrome v-model="colors.bgColor2" class="mt-2" />
            <h3 class="mt-4 text-blue-400 font-semibold">Warna Text</h3>
            <Chrome v-model="colors.textColor" class="mt-2" />
            <h3 class="mt-4 text-blue-400 font-semibold">Warna Tombol</h3>
            <Chrome v-model="colors.btnColor1" class="mt-2" />
            <h3 class="mt-4 text-blue-400 font-semibold">Hover Tombol</h3>
            <Chrome v-model="colors.btnColor2" class="mt-2" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavPartial from '@/components/NavPartial.vue';
import { ref, watch } from 'vue';
import { Chrome } from '@ckpack/vue-color';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/stores/stores';
import Swal from 'sweetalert2';

const uid = ref(null);
const authStore = useAuthStore();
const colors = ref({
  bgColor1: '#ffffff',
  bgColor2: '#ffffff',
  textColor: '#ffffff',
  btnColor1: '#ffffff',
  btnColor2: '#ffffff',
});
const form = ref({
  url: '',
});

const changeUrl = async () => {
  try {
    const { data, error } = await supabase
      .from('display')
      .update({ bg_url: form.value.url })
      .eq('user_id', uid.value.id);
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
      title: 'Url gambar background diubah!'
    })
  } catch (error) {
    console.error("Error updating phone number:", error);
  }
};

watch(
  () => authStore.currentUser,
  async (newVal) => {
    if (newVal) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', newVal.id)
        .single();

      if (error) throw error;
      uid.value = data;
      await fetchDisplay();
    }
  },
  { immediate: true }
);

const extractHexColors = (colors) => {
  return {
    bgColor1: colors.bgColor1.hex,
    bgColor2: colors.bgColor2.hex,
    textColor: colors.textColor.hex,
    btnColor1: colors.btnColor1.hex,
    btnColor2: colors.btnColor2.hex,
  };
};

watch(colors, async (newColors) => {
  if (uid.value) {
    const hexColors = extractHexColors(newColors);
    await updateColorsInSupabase(hexColors);
  }
}, { deep: true });

const fetchDisplay = async () => {
  try {
    const { data, error } = await supabase
      .from('display')
      .select('*')
      .eq('user_id', uid.value.id)
      .single();

    if (error) throw error;
    if(data.bg_url) {
      form.value.url = data.bg_url
    }
    if (data) {
      colors.value = {
        bgColor1: data.bg_color1 || '#ffffff',
        bgColor2: data.bg_color2 || '#ffffff',
        textColor: data.text_color || '#ffffff',
        btnColor1: data.bg_button || '#ffffff',
        btnColor2: data.bg_hover || '#ffffff',
      };
    }
  } catch (error) {
    console.error('Error fetching display data:', error);
  }
};

const updateColorsInSupabase = async (newColors) => {
  try {
    const { error } = await supabase
      .from('display')
      .update({
        bg_color1: newColors.bgColor1,
        bg_color2: newColors.bgColor2,
        text_color: newColors.textColor,
        bg_button: newColors.btnColor1,
        bg_hover: newColors.btnColor2,
      })
      .eq('user_id', uid.value.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating colors:', error);
  }
};
</script>

<style>
/* Tambahkan gaya kustom jika diperlukan */
</style>
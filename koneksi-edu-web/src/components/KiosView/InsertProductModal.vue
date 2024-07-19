<template>
  <div style="z-index: 10;" v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg w-80">
      <h2 class="text-blue-800 text-xl mb-4 font-semibold text-center">{{ isEdit ? 'Edit Produk' : 'Tambah Produk' }}</h2>
      <form @submit.prevent="isEdit ? updateProduct() : addProduct()">
        <div class="mb-4">
          <label for="title" class="block mb-2 text-blue-800">Judul</label>
          <input v-model="form.title" type="text" id="title" name="title" placeholder="Judul produk" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none">
          <p v-if="errors.title" class="text-blue-500 text-xs mt-1">{{ errors.title }}</p>
        </div>
        <div class="mb-4">
          <label for="image_url" class="block mb-2 text-blue-800">URL Gambar</label>
          <input v-model="form.image_url" type="url" id="image_url" name="image_url" placeholder="https://contoh.com/contoh.jpg" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none">
          <p v-if="errors.image_url" class="text-blue-500 text-xs mt-1">{{ errors.image_url }}</p>
        </div>
        <div class="mb-4">
          <label for="price" class="block mb-2 text-blue-800">Harga</label>
          <input v-model.number="form.price" type="number" id="price" name="price" placeholder="Harga produk" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none appearance-none">
          <p v-if="errors.price" class="text-blue-500 text-xs mt-1">{{ errors.price }}</p>
        </div>
        <div class="mb-4">
          <label for="desc" class="block mb-2 text-blue-800">Deskripsi</label>
          <textarea v-model="form.desc" id="desc" name="desc" rows="3" placeholder="Deskripsi produk" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none"></textarea>
          <p v-if="errors.desc" class="text-blue-500 text-xs mt-1">{{ errors.desc }}</p>
        </div>
        <div class="mb-4">
          <label for="is_active" class="flex items-center">
            <input v-model="form.is_active" type="checkbox" id="is_active" name="is_active" class="mr-2">
            <span class="text-sm font-medium text-blue-800">Aktif</span>
          </label>
        </div>
        <div class="mb-4">
          <button type="submit" class="font-semibold w-full bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none mt-2 hover:bg-blue-600">{{ isEdit ? 'Simpan Perubahan' : 'Simpan' }}</button>
          <button @click="closeModal" type="button" class="font-semibold w-full mt-2 bg-blue-800 text-blue-100 py-2 px-4 rounded-md focus:outline-none">Batal</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/stores/stores';

const props = defineProps({
  editProduct: Object,
  showModal: Boolean
});

const emit = defineEmits(['productAdded', 'productUpdated', 'closeModal']);

const authStore = useAuthStore();
const uid = ref(null);
const username = ref(null);

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
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
}, { immediate: true });

const form = ref({
  title: '',
  image_url: '',
  price: '',
  desc: '',
  is_active: false
});

const errors = ref({
  title: '',
  image_url: '',
  price: '',
  desc: ''
});

const isEdit = ref(false);

watch(() => props.editProduct, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
    isEdit.value = true;
  } else {
    form.value = {
      title: '',
      image_url: '',
      price: '',
      desc: '',
      is_active: false
    };
    isEdit.value = false;
  }
}, { immediate: true });

const addProduct = async () => {
  Object.keys(errors.value).forEach(key => errors.value[key] = '');

  // Validation
  if (!form.value.title.trim()) {
    errors.value.title = 'Judul wajib diisi';
    return;
  }
  if (!form.value.image_url.trim() || !isValidURL(form.value.image_url.trim())) {
    errors.value.image_url = 'URL Gambar tidak valid';
    return;
  }
  if (!form.value.price) {
    errors.value.price = 'Harga wajib diisi';
    return;
  }
  if (form.value.price < 0) {
    errors.value.price = 'Harga tidak boleh kurang dari 0';
    return;
  }
  if (!form.value.desc.trim()) {
    errors.value.desc = 'Deskripsi wajib diisi';
    return;
  }

  const { error } = await supabase
    .from('kios_products')
    .insert({
      title: form.value.title,
      image_url: form.value.image_url,
      is_active: form.value.is_active,
      price: form.value.price,
      desc: form.value.desc,
      username: username.value,
      user_id: uid.value
    });
  emit('productAdded');
  closeModal();
};

const updateProduct = async () => {
  Object.keys(errors.value).forEach(key => errors.value[key] = '');

  // Validation
  if (!form.value.title.trim()) {
    errors.value.title = 'Judul wajib diisi';
    return;
  }
  if (!form.value.image_url.trim() || !isValidURL(form.value.image_url.trim())) {
    errors.value.image_url = 'URL Gambar tidak valid';
    return;
  }
  if (!form.value.price) {
    errors.value.price = 'Harga wajib diisi';
    return;
  }
  if (form.value.price < 0) {
    errors.value.price = 'Harga tidak boleh kurang dari 0';
    return;
  }
  if (!form.value.desc.trim()) {
    errors.value.desc = 'Deskripsi wajib diisi';
    return;
  }

  const { error } = await supabase
    .from('kios_products')
    .update({
      title: form.value.title,
      image_url: form.value.image_url,
      is_active: form.value.is_active,
      price: form.value.price,
      desc: form.value.desc
    })
    .eq('id', props.editProduct.id);

  closeModal();
};

const closeModal = () => {
  emit('closeModal');
};

const isValidURL = (url) => {
  // Basic URL validation, you can extend this
  return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
};

defineExpose({ form })
</script>

<style scoped>
/* No custom styles needed as per Tailwind CSS usage */
</style>
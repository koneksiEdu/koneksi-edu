<template>
  <div class="mt-4 w-full flex flex-col items-center">
    <component
      v-for="link in activeLinks"
      :key="link.id"
      :is="getComponentType(link.type)"
      :link="link"
      class="w-full mb-2"
    ></component>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import ButtonComponent from '@/components/UserPageView/LinksPage/ButtonComponent.vue'
import HeaderComponent from '@/components/UserPageView/LinksPage/HeaderComponent.vue'
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/stores';

const authStore = useAuthStore();
const route = useRoute();
const links = ref([]);
const uid = ref("");

const fetchLinks = async (userId) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('links')
      .select('link_values')
      .eq('user_id', userId)
      .single();
    if (profileError) {
      throw profileError;
    }
    if (!profile) {
      throw new Error("Profile not found");
    }
    links.value = profile.link_values || [];
  } catch (fetchError) {
    console.error("Error fetching profile:", fetchError);
  }
}

const getComponentType = (type) => {
  return type === 'button' ? ButtonComponent : HeaderComponent;
}

const activeLinks = computed(() => {
  return links.value.filter(link => link.isActive);
});

watch(() => authStore.currentUser, async (newVal) => {
  if (newVal) {
    uid.value = newVal.id;
    await fetchLinks(uid.value);
  }
}, { immediate: true });

</script>

<style scoped>
.links-container {
  justify-content: center; /* Center flex items horizontally */
  align-items: flex-start; /* Align flex items to the top */
}
</style>
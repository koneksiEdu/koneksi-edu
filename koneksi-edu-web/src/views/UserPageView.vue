<template>
  <div class="flex justify-center min-h-screen bg-gradient-to-r from-pink-500 to-yellow-500">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-sm bg-opacity-75 w-full text-center my-4 mx-4">
      <div v-if="errorMsg" class="text-red-500 mb-4">
        {{ errorMsg }}
      </div>
      <div v-else>
        <div class="flex justify-center mb-4 animate__animated animate__bounceIn">
          <img :src="imgUrl" class="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
        </div>
        <div class="bio">
          <h1 class="text-2xl font-semibold mb-2">@{{ username }}</h1>
          <p class="text-gray-600">
            <TypewriterComponent :text="bio" />
          </p>
        </div>
        <LinksPage/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';
import LinksPage from '@/components/UserPageView/LinksPage.vue';
import TypewriterComponent from '@/components/TypeWriterEffect.vue'

export default {
  components: {
    TypewriterComponent,
    LinksPage
  },
  setup() {
    const route = useRoute();
    const username = ref(route.params.id);
    const imgUrl = ref("");
    const bio = ref("");
    const errorMsg = ref("");

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
        imgUrl.value = `https://lkyubyoimdryxsrpsbli.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`;
        bio.value = profile.bio;
        errorMsg.value = ""; // Clear any previous error
      } catch (fetchError) {
        console.error("Error fetching profile:", fetchError);
        errorMsg.value = "Profil tidak ditemukan atau kesalahan terjadi saat mengambil data profil.";
        imgUrl.value = "";
        bio.value = "";

      }
    };

    fetchProfile(username.value);

    watch(() => route.params.id, (newUsername) => {
      username.value = newUsername;
      fetchProfile(newUsername);
    });

    return {
      username,
      imgUrl,
      bio,
      errorMsg
    };
  }
};
</script>
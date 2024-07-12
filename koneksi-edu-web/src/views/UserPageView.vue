<template>
  <div class="flex justify-center min-h-screen bg-gradient-to-r from-pink-500 py-2 to-yellow-500">
    <div class="bg-white p-2 rounded-lg shadow-md max-w-xs h-[672px] bg-opacity-75 w-full my-auto mx-4 flex flex-col justify-between" :style="{ background: `url('/ppob-vn/office1.png') no-repeat center center`, backgroundSize: 'cover' }">
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
        <div class="bg-white bg-opacity-50 p-2 rounded-md mt-2 h-[520px] overflow-y-auto hidden-scrollbar">
          <LinksPage/>
          <LocationPage ref="komponenLokasi" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';
import LinksPage from '@/components/UserPageView/LinksPage.vue';
import LocationPage from '@/components/UserPageView/LocationPage.vue';
import TypewriterComponent from '@/components/TypeWriterEffect.vue';

export default {
  components: {
    TypewriterComponent,
    LinksPage,
    LocationPage
  },
  setup() {
    const route = useRoute();
    const username = ref(route.params.id);
    const imgUrl = ref("");
    const bio = ref("");
    const errorMsg = ref("");
    const komponenLokasi = ref(null);

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
        errorMsg.value = ""; // Clear any previous error
      } catch (fetchError) {
        console.error("Error fetching profile:", fetchError);
        errorMsg.value = "Profil tidak ditemukan atau kesalahan terjadi saat mengambil data profil.";
        imgUrl.value = "";
        bio.value = "";
      }
    };

    onMounted(async () => {
      await fetchProfile(username.value);
      await nextTick(); // Wait for the DOM to update
      if (komponenLokasi.value) {
        komponenLokasi.value.checkMap(username.value);
      }
    });

    return {
      username,
      imgUrl,
      bio,
      errorMsg,
      komponenLokasi
    };
  }
};
</script>

<style>
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

.hidden-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
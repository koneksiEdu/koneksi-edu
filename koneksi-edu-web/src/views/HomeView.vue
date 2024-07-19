<script setup>
import HeaderPartial from '@/components/HeaderPartial.vue'

</script>

<template>
  <HeaderPartial />
  <main>
    <div class="min-h-screen bg-blue-400 pt-24">
      <div class="container mx-auto">
        <div class="md:grid md:grid-cols-2 gap-4">
          <div class="mx-[24px]">
            <div class="text-white font-bold text-3xl md:text-6xl">Ciptakan link bio untuk kamu penggiat UMKM.</div>
            <div class="mt-6 font-semibold md:text-2xl text-md text-white">Tambahkan link social media Anda ke link bio, atur widget sesuai kebutuhan Anda dan tambahkan produk Anda. Tunggu apalagi segera buat link bio Ada dengan klik <RouterLink to="/signup" class="px-1 rounded-md bg-gray-200 text-blue-400">Daftar</RouterLink></div>
          </div>
          <div class="animate__animated animate__pulse animate__infinite bg-white mb-4 mt-4 mx-auto p-2 rounded-lg shadow-md max-w-xs h-[320px] bg-opacity-75 w-full my-auto mx-4 flex flex-col">
            <img src="../assets/orang.svg" class="animate__animated animate__flipInY w-16 h-16 rounded-full mx-auto" />
            <div class="bg-white mt-2 p-4 text-center text-blue-400">Klik tombol di bawah untuk lihat contoh link bio kami!</div>
            <div class="mt-2 bg-blue-500 rounded-full p-2 font-semibold text-lg text-white text-center"><a target="_blank" href="/pakitam">Klik di sini!</a></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

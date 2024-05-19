<template>
    <header class="fixed w-full bg-white shadow-md z-50">
      <div class="container mx-auto p-4 flex justify-between items-center">
        <div class="flex items-center">
          <img src="../assets/logoipsum-325.svg" alt="Logo" class="h-10">
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <!-- Search Bar -->
          <input
            type="text"
            placeholder="Search"
            class="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
          />
          <!-- Desktop Nav -->
          <nav class="space-x-4">
            <a href="#" class="text-gray-700 hover:text-gray-900">Home</a>
            <a href="#" class="text-gray-700 hover:text-gray-900">About</a>
            <a href="#" class="text-gray-700 hover:text-gray-900">Services</a>
            <a href="#" class="text-gray-700 hover:text-gray-900">Contact</a>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Menu Toggle Button -->
          <button @click="toggleMenu" class="text-gray-700 focus:outline-none md:hidden">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-if="isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <img src="../assets/user.svg" alt="User" class="h-10 rounded-full">
        </div>
      </div>
      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div v-if="isMenuOpen" class="md:hidden">
          <nav class="bg-white ">
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Home</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">About</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Services</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Contact</a>
            <!-- Search bar for mobile -->
            <div class="mt-3 px-2">
              <input
                type="text"
                placeholder="Search"
                class="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-3 pr-3 focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
              />
            </div>
          </nav>
        </div>
      </transition>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isMenuOpen: false,
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
    transform: translateY(-10px);
    opacity: 0;
  }
  </style>
  
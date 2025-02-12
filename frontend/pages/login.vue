<template>
  <div>
    <h1>Login</h1>

    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="authStore.login(email, password)">Login</button>

    <button @click="authStore.loginWithGoogle">Login with Google</button>

    <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>

    <p>Don't have an account? <NuxtLink to="/register">Create one</NuxtLink></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/store/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore(); 

definePageMeta({
  middleware: "redirect-if-authenticated",
});
</script>

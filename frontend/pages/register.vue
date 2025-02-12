<template>
  <div>
    <h1>Register</h1>

    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="authStore.register(email, password)">Create Account</button>

    <p v-if="authStore.errorMessage" class="error">{{ authStore.errorMessage }}</p>

    <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
</script>

<style scoped>
.error {
  color: red;
}
</style>

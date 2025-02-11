<template>
  <div>
    <h1>Register</h1>

    <!-- Email/Password Signup -->
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="register">Create Account</button>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Navigation to Login -->
    <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");

let auth, createUserWithEmailAndPassword;
const router = useRouter();

onMounted(() => {
  // 🚀 Load Firebase on the client side
  const nuxtApp = useNuxtApp();
  auth = nuxtApp.$auth;
  createUserWithEmailAndPassword = nuxtApp.$createUserWithEmailAndPassword;
});

// 🚀 Register New User
async function register() {
  try {
    if (!auth || !createUserWithEmailAndPassword) throw new Error("Firebase not initialized.");

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    console.log("Account created successfully!", token);

    // Redirect to login after successful registration
    router.push("/login");
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

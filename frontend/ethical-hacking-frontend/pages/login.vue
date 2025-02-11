<template>
  <div>
    <h1>Login</h1>

    <!-- Email/Password Login -->
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="login">Login</button>

    <!-- Google Login Button -->
    <button @click="loginWithGoogle">Login with Google</button>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Navigation to Register -->
    <p>Don't have an account? <NuxtLink to="/register">Create one</NuxtLink></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter(); // Use router to navigate

let auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword;

definePageMeta({
  middleware: "redirect-if-authenticated", // Redirect if user is already logged in
});

onMounted(() => {
  // 🚀 Load Firebase on the client side
  const nuxtApp = useNuxtApp();
  auth = nuxtApp.$auth;
  signInWithPopup = nuxtApp.$signInWithPopup;
  GoogleAuthProvider = nuxtApp.$GoogleAuthProvider;
  signInWithEmailAndPassword = nuxtApp.$signInWithEmailAndPassword;
});

// Standard Email/Password Login
async function login() {
  try {
    if (!auth) throw new Error("Firebase not initialized.");

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("auth_token", token);

    console.log("Logged in successfully!");

    // Redirect to dashboard after login
    router.push("/dashboard");

  } catch (error) {
    errorMessage.value = error.message;
  }
}

// 🚀 Google Login
async function loginWithGoogle() {
  try {
    if (!auth || !signInWithPopup || !GoogleAuthProvider) throw new Error("Firebase not initialized.");

    const result = await signInWithPopup(auth, GoogleAuthProvider);
    const token = await result.user.getIdToken();
    localStorage.setItem("auth_token", token);
    console.log("Google Login Successful!");

    router.push("/dashboard");
    
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>
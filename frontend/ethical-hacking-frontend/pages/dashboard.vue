<template>
  <div>
    <button @click="logout">Logout</button>
    <h1>Welcome to your dashboard</h1>
    <DashboardInfo />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth", // 🔒 Protect the page with auth middleware
});

import DashboardInfo from "~/components/DashboardInfo.vue";
import { useCookie } from "#app";

function logout() {
  useCookie("auth_token").value = null; // Remove token from cookies
  localStorage.removeItem("auth_token"); // Remove from local storage
  navigateTo("/login"); // Redirect to login
}

</script>
<template>
  <div>
    <button @click="authStore.signOutUser">Logout</button>
    <h1>Welcome to your dashboard</h1>
    <DashboardInfo />
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth";
import DashboardInfo from "~/components/DashboardInfo.vue";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
</script>

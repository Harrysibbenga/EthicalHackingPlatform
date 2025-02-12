import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#app";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return; // ✅ Prevent running on the server

  const authStore = useAuthStore();
  const { $auth } = useNuxtApp();

  if (!authStore.user && (!$auth || !$auth.currentUser)) {
    console.warn("🚨 User not authenticated! Redirecting to login.");
    return navigateTo("/login");
  } else {
    if (to.path === "/login") {
      console.info("🔄 User already authenticated. Redirecting to dashboard.");
      return navigateTo("/dashboard");
    }
    return; // ✅ Continue navigation
  }
})
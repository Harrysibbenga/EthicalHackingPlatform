export default defineNuxtRouteMiddleware(async (to, from) => {
  const authToken = useCookie("auth_token");
  const token = authToken.value || localStorage.getItem("auth_token");

  if (!token) {
    console.warn("🔒 No auth token found. Redirecting to login.");
    return navigateTo("/login");
  }

  try {
    // ✅ Verify user via API
    const response = await $fetch("http://127.0.0.1:8000/verify-user", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ User Verification Response:", response);

    if (response.valid) {
      if (to.path === "/login") {
        console.info("🔄 User already authenticated. Redirecting to dashboard.");
        return navigateTo("/dashboard");
      }
      return; // ✅ Continue navigation
    }
  } catch (error) {
    console.error("🚨 Invalid token detected:", error);

    // ✅ Clear invalid token
    authToken.value = null;
    localStorage.removeItem("auth_token");

    return navigateTo("/login");
  }
});

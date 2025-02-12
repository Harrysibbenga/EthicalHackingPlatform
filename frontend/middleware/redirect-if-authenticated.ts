export default defineNuxtRouteMiddleware(() => {
  const authToken = useCookie("auth_token");
  const token = authToken.value || localStorage.getItem("auth_token");

  if (token) {
    console.info("🔄 User already logged in. Redirecting to dashboard.");
    return navigateTo("/dashboard");
  }
});

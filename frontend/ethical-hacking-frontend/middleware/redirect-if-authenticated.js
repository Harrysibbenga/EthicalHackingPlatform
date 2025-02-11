export default defineNuxtRouteMiddleware(() => {
  const token =
    useCookie("auth_token").value || localStorage.getItem("auth_token");

  if (token) {
    return navigateTo("/dashboard"); // Redirect to dashboard if already logged in
  }
});

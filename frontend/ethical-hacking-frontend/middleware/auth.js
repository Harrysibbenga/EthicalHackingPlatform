export default defineNuxtRouteMiddleware(async (to, from) => {
  // Retrieve token from cookies first, then fallback to localStorage
  const token =
    useCookie("auth_token").value || localStorage.getItem("auth_token");

  if (!token) {
    return navigateTo("/login"); // Redirect if no token
  }

  try {
    const response = await $fetch("http://127.0.0.1:8000/verify-user", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Log response for debugging
    console.log("User Verification Response:", response);

    // If the response is valid, allow access
    if (response.valid) {
      if (to.path === "/login") {
        // ✅ If user is already logged in, redirect to dashboard
        return navigateTo("/dashboard");
      }
      return; // ✅ Continue to the requested route
    }
  } catch (error) {
    console.error("Invalid token", error);

    // If token is invalid, clear it and redirect to login
    useCookie("auth_token").value = null;
    localStorage.removeItem("auth_token");
    return navigateTo("/login");
  }
});

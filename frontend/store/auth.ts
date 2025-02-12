import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { useCookie, useRouter } from "#app";

// ✅ Define Pinia Store
export const useAuthStore = defineStore("auth", () => {
  const auth = getAuth();
  const router = useRouter();
  const user = ref(null);
  const errorMessage = ref("");
  const authToken = ref(localStorage.getItem("auth_token") || null); // ✅ Store token in Pinia

  // ✅ Store token in Pinia & localStorage (instead of `useCookie()`)
  const setAuthToken = (token: string | null) => {
    authToken.value = token;

    const cookie = useCookie("auth_token", {
      maxAge: 60 * 60 * 24 * 7, // ✅ Set cookie for 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    if (token === null) {

      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("auth_token");
      console.log("🔹 Token Removed. Local Storage Value:", authToken.value);

    } else {

      cookie.value = token;
      localStorage.setItem("auth_token", token);
      console.log("🔹 Token Set. Local Storage Value:", authToken.value);
    }
  };

  // 🚀 **Register New User**
  async function register(email: string, password: string) {
    try {
      console.log("🚀 Before Registration:", user.value); // Debug

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      console.log("✅ Firebase Returned User:", userCredential.user); // Debug

      user.value = userCredential.user; // ✅ Updating the ref()

      console.log("🔥 Updated User State:", user.value); // Debug

      const token = await userCredential.user.getIdToken();
      setAuthToken(token);
    } catch (error) {
      errorMessage.value = error.message || "An error occurred during registration.";
    }
  }

  // 🚀 **Login User**
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      user.value = userCredential.user;
      setAuthToken(token);

      console.log("✅ Logged in successfully!");

      // ✅ Redirect to dashboard or previous route
      router.push("/dashboard");
    } catch (error) {
      errorMessage.value = error.message || "Login failed.";
    }
  }

  // 🚀 **Login with Google**
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      user.value = result.user;
      setAuthToken(token);

      console.log("✅ Google Login Successful!");

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      errorMessage.value = error.message || "Google login failed.";
    }
  }

  // 🚪 **Logout User**
  async function logout() {
    try {
      await signOut(auth);
      user.value = null; // ✅ Clear user state
      setAuthToken(null); // ✅ Ensure token is cleared

      console.log("✅ User logged out. Token removed:", useCookie("auth_token").value); // Debugging
      router.push("/login");
    } catch (error: any) {
      console.error("❌ Logout Error:", error.message);
    }
  }

  // 🔄 **Check if User is Already Logged In**
  function checkAuthState() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser;
        console.log("🔄 User session restored:", firebaseUser.email);
      } else {
        user.value = null;
        console.log("🔄 No active user session.");
      }
    });
  }

  return { user, errorMessage, register, login, loginWithGoogle, logout, checkAuthState, setAuthToken };
});

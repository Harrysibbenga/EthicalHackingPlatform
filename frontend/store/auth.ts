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

  // ✅ Store token in cookies for SSR compatibility
  const setAuthToken = (token: string) => {
    const authToken = useCookie("auth_token");
    authToken.value = token;
  };

  // 🚀 **Register New User**
  async function register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      user.value = userCredential.user;
      setAuthToken(token);

      console.log("✅ Account created successfully!");
      
      // ✅ Redirect to login after successful registration
      router.push("/login");
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
  async function signOutUser() {
    try {
      await signOut(auth);
      user.value = null;

      // ✅ Clear token from cookies
      const authToken = useCookie("auth_token");
      authToken.value = null;

      console.log("✅ Signed out successfully!");

      // ✅ Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("🚨 Error signing out:", error);
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

  return { user, errorMessage, register, login, loginWithGoogle, signOutUser, checkAuthState };
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";

const mockUser = ref(null); // ✅ Ensure it's a ref

const mockAuth = {
    currentUser: mockUser,
    createUserWithEmailAndPassword: vi.fn(async (auth, email, password) => {
        mockUser.value = { email, uid: "mock-uid-123", getIdToken: () => "fake-token" };
        return { user: mockUser.value };
    }),
    signInWithEmailAndPassword: vi.fn(async (auth, email, password) => {
        mockUser.value = { email, uid: "mock-uid-123", getIdToken: () => "fake-token" };
        return { user: mockUser.value };
    }),
    signOut: vi.fn(async () => {
        mockUser.value = null;
    })
};

// ✅ Mock Nuxt Composables (`useCookie()` and `useRouter()`)
const mockAuthToken = ref(null); // ✅ Simulated cookie storage

vi.mock("firebase/auth", () => ({
    getAuth: () => mockAuth,
    createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
    signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
    signOut: mockAuth.signOut,
}));


// ✅ Mock `#app` (Nuxt-specific functions)
vi.mock("#app", () => ({
    useCookie: vi.fn(() => mockAuthToken),
    useRouter: vi.fn(() => ({
        push: vi.fn(), // ✅ Mock navigation
    })),
}));

// ✅ Mock `~/store/auth.ts`
vi.mock("~/store/auth", () => ({
    useAuthStore: vi.fn(() => ({
        user: mockUser,
        errorMessage: "",
        authToken: mockAuthToken,
        register: vi.fn(async (email, password) => {
            mockUser.value = { email, getIdToken: () => "fake-token" };
        }),
        login: vi.fn(async (email, password) => {
            mockUser.value = { email, getIdToken: () => "fake-token" };
        }),
        loginWithGoogle: vi.fn(async () => {
            mockUser.value = { email: "google-user@example.com", getIdToken: () => "fake-google-token" };
        }),
        logout: vi.fn(async () => {
            mockUser.value = null;
        }),
        setAuthToken: vi.fn((token) => {
            mockAuthToken.value = token; // ✅ Simulate token storage
        }),
    })),
}));

// ✅ Import the mocked auth store AFTER mocking
import { useAuthStore } from "~/store/auth";

describe("Auth Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia()); // ✅ Initialize Pinia before each test
        mockUser.value = null; // ✅ Reset user before each test
        mockAuthToken.value = null; // ✅ Reset auth token before each test
    });

    it("should register a new user and update user ref", async () => {
        const authStore = useAuthStore();

        console.log("🔥 Before Registration Test:", authStore.user.value); // Debug

        await authStore.register("test@example.com", "password123");

        console.log("🚀 After Registration Test:", authStore.user.value); // Debug

        expect(authStore.user.value).not.toBeNull(); // ✅ Ensures user exists
        expect(authStore.user.value?.email).toBe("test@example.com"); // ✅ Using `?.` to prevent null errors
        expect(authStore.user.value?.getIdToken()).toBe("fake-token");
    });

    it("logs in a user", async () => {
        const authStore = useAuthStore();

        console.log("🔥 Before Login Test:", authStore.user.value); // Debug

        await authStore.login("test@example.com", "password123");

        console.log("🚀 After Login Test:", authStore.user.value); // Debug

        expect(authStore.user.value).not.toBeNull();
        expect(authStore.user.value?.email).toBe("test@example.com");
        expect(authStore.user.value?.getIdToken()).toBe("fake-token");
    });

    it("logs in with Google", async () => {
        const authStore = useAuthStore();

        console.log("🔥 Before Google Test:", authStore.user.value); // Debug

        await authStore.loginWithGoogle();

        console.log("🚀 After Google Test:", authStore.user.value); // Debug

        expect(authStore.user.value).not.toBeNull();
        expect(authStore.user.value?.email).toBe("google-user@example.com"); // ✅ Fix: Ensure correct email is checked
        expect(authStore.user.value?.getIdToken()).toBe("fake-google-token");
    });

    it("logs out the user and clears auth token", async () => {
        const authStore = useAuthStore();

        // ✅ Simulate login
        await authStore.login("test@example.com", "password123");

        console.log("🔥 Before Logout Test:", authStore.user.value);

        // ✅ Set user and token before logout
        authStore.user.value = { email: "test@example.com", getIdToken: () => "fake-token" };

        // ✅ Ensure the token is set before logout
        console.log("🔥 Token Before Logout (Pinia):", authStore.authToken.value);

        // ✅ Perform logout
        await authStore.logout();

        console.log("🚀 After Logout Test:", authStore.user.value);

        // ✅ Verify user state is cleared
        expect(authStore.user.value).toBeNull();
        expect(localStorage.getItem("auth_token")).toBeNull(); // 🔥 Ensures local storage token is removed
    });

});

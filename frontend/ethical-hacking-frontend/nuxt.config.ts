export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
  },

  // 🚀 Disable SSR since Firebase is client-only
  ssr: false,

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: "Nuxt Firebase Auth",
      meta: [{ name: "description", content: "Firebase authentication in Nuxt 3" }],
    },
  },

  compatibilityDate: "2025-02-10",
});
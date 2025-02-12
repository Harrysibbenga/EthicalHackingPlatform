<template>
  <div>
    <p>Welcome to the Ethical Hacking Learning Platform Dashboard!</p>
    <button @click="fetchData">Fetch Backend Message</button>
    <p v-if="message">Backend Response: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("");

async function fetchData() {
  try {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
</script>
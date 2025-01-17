<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const totalProducts = ref<number | null>(null); 
const error = ref<string | null>(null); 

const fetchProductCount = async () => {
  try {
    const response = await axios.get('http://localhost:8989/api/produtos');
    if (response.data && typeof response.data.total === 'number') {
      totalProducts.value = response.data.total; 
    } else {
      throw new Error('Formato de resposta inesperado');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Erro ao buscar produtos';
    } else {
      error.value = 'Erro desconhecido';
    }
  }
};

onMounted(() => {
  fetchProductCount();
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-2">Total de Produtos</h2>
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <p v-else-if="totalProducts !== null" class="text-3xl font-bold">{{ totalProducts }}</p>
        <p v-else class="text-gray-500">Carregando...</p>
      </div>
    </div>
  </div>
</template>
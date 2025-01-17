<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { addProduct } = useProducts()

const productName = ref('')
const price = ref(0)
const description = ref('')
const expiryDate = ref('')
const categoryId = ref('')
const imageUrl = ref('')
const isSubmitting = ref(false)

const categories = ref<{ id: string; name: string }[]>([])

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8989/api/categorias')
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias')
    }
    const data = await response.json()
    categories.value = data.map((cat: { id: string; name: string }) => ({
      id: cat.id,
      name: cat.name
    }))
  } catch (error) {
  }
}

onMounted(() => {
  fetchCategories()
})

const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  isSubmitting.value = true

  const adjustedExpiryDate = new Date(expiryDate.value)
  adjustedExpiryDate.setDate(adjustedExpiryDate.getDate() + 1)
  const formattedExpiryDate = adjustedExpiryDate.toISOString().split('T')[0]

  const productData = {
    name: productName.value,
    price: price.value,
    description: description.value,
    expiration_date: formattedExpiryDate,
    categoria_id: categoryId.value,
    image: imageUrl.value
  }


  try {
    await addProduct(productData);
    router.push('/dashboard/products');
  } catch (error) {
    alert('Erro ao cadastrar produto. Verifique os dados e tente novamente.');
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Cadastrar Produto</h1>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <form @submit="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            id="name"
            v-model="productName"
            type="text"
            maxlength="50"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nome do produto (máx. 50 caracteres)"
          />
          <p class="text-sm text-gray-500 mt-1">
            {{ productName.length }}/50 caracteres
          </p>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <input
            id="price"
            v-model="price"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            v-model="description"
            rows="4"
            maxlength="200"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descrição do produto (máx. 200 caracteres)"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">
            {{ description.length }}/200 caracteres
          </p>
        </div>

        <div>
          <label for="expiry" class="block text-sm font-medium text-gray-700 mb-1">
            Data de Validade
          </label>
          <input
            id="expiry"
            v-model="expiryDate"
            type="date"
            :min="getCurrentDate()"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            id="category"
            v-model="categoryId"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem
          </label>
          <input
            id="imageUrl"
            v-model="imageUrl"
            type="url"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          :disabled="isSubmitting"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
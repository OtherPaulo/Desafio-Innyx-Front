<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCategories, getProducts, deleteProduct, updateProduct } from '../services/api'
import ProductModals from '../components/Products/ProductModals.vue'

interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  expiration_date: string
  image: string
  categoria_id: number
  categoria: Category
  created_at: string
  updated_at: string
}

const products = ref<Product[]>([])
const allProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const currentPage = ref(1)
const lastPage = ref(1)
const searchTerm = ref('')
const selectedCategory = ref<string>('')
const maxPrice = ref<number | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const editingProduct = ref<Product | null>(null)
const originalProduct = ref<Product | null>(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)
const expandedProductId = ref<number | null>(null)

const filteredProducts = computed(() => {
  return allProducts.value.filter(product => {
    const matchesSearch = searchTerm.value === '' || 
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesCategory = selectedCategory.value === '' || 
      product.categoria?.name === selectedCategory.value
    
    const matchesPrice = !maxPrice.value || product.price <= maxPrice.value
    
    return matchesSearch && matchesCategory && matchesPrice
  })
})

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * 10
  const endIndex = startIndex + 10
  return filteredProducts.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / 10)
})

const loadData = async () => {
  isLoading.value = true
  try {
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getProducts({})
    ])
    
    categories.value = categoriesData
    allProducts.value = productsData.data
    products.value = paginatedProducts.value
    lastPage.value = totalPages.value
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  products.value = paginatedProducts.value
  lastPage.value = totalPages.value
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  products.value = paginatedProducts.value
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!productToDelete.value) return
  
  isDeleting.value = true
  try {
    await deleteProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    await loadData()
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    isDeleting.value = false
  }
}

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const openEditModal = (product: Product) => {
  originalProduct.value = JSON.parse(JSON.stringify(product))
  editingProduct.value = JSON.parse(JSON.stringify(product))
  
  if (editingProduct.value) {
    editingProduct.value.expiration_date = formatDateForInput(product.expiration_date)
  }
  
  showEditModal.value = true
}

const handleUpdate = async () => {
  if (!editingProduct.value) return
  
  isSaving.value = true
  try {
    await updateProduct(editingProduct.value.id, {
      name: editingProduct.value.name,
      description: editingProduct.value.description,
      price: editingProduct.value.price,
      expiration_date: editingProduct.value.expiration_date,
      categoria_id: editingProduct.value.categoria_id,
      image: editingProduct.value.image
    })
    
    showEditModal.value = false
    editingProduct.value = null
    originalProduct.value = null
    await loadData()
  } catch (error) {
    console.error('Error updating product:', error)
  } finally {
    isSaving.value = false
  }
}

const toggleProductExpand = (productId: number) => {
  expandedProductId.value = expandedProductId.value === productId ? null : productId
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold">Lista de Produtos</h1>
      <router-link
        to="/dashboard/products/new"
        class="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Novo Produto</span>
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o nome do produto"
            @input="handleSearch"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            id="category"
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="handleSearch"
          >
            <option value="">Todas as categorias</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
            Preço Máximo
          </label>
          <input
            id="price"
            v-model="maxPrice"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="R$ 0,00"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-4 text-center">Carregando...</td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="5" class="px-6 py-4 text-center">Nenhum produto encontrado.</td>
            </tr>
            <template v-else v-for="product in products" :key="product.id">
              <tr>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img :src="product.image" class="h-10 w-10 rounded-full object-cover" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">
                        <template v-if="product.description.length > 100">
                          {{ expandedProductId === product.id ? product.description : product.description.slice(0, 100) + '...' }}
                          <button 
                            @click="toggleProductExpand(product.id)"
                            class="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            {{ expandedProductId === product.id ? 'Ver menos' : 'Ver mais' }}
                          </button>
                        </template>
                        <template v-else>
                          {{ product.description }}
                        </template>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ product.categoria?.name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatPrice(product.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(product.expiration_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button
                      @click="openEditModal(product)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      @click="confirmDelete(product)"
                      class="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="lastPage > 1" class="px-6 py-4 flex justify-center space-x-2">
        <button
          v-for="page in lastPage"
          :key="page"
          @click="handlePageChange(page)"
          class="px-3 py-1 rounded-md"
          :class="currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <ProductModals
      v-model:showEditModal="showEditModal"
      v-model:showDeleteModal="showDeleteModal"
      :editingProduct="editingProduct"
      :productToDelete="productToDelete"
      :categories="categories"
      :isSaving="isSaving"
      :isDeleting="isDeleting"
      :originalProduct="originalProduct"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </div>
</template>
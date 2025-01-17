<script setup lang="ts">
import { computed } from 'vue'

interface Category {
  id: number
  name: string
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
}

const props = defineProps<{
  showEditModal: boolean
  showDeleteModal: boolean
  editingProduct: Product | null
  productToDelete: Product | null
  categories: Category[]
  isSaving: boolean
  isDeleting: boolean
  originalProduct: Product | null
}>()

const emit = defineEmits<{
  'update:showEditModal': [value: boolean]
  'update:showDeleteModal': [value: boolean]
  'delete': []
  'update': []
}>()

const hasChanges = computed(() => {
  if (!props.editingProduct || !props.originalProduct) return false

  return (
    props.editingProduct.name !== props.originalProduct.name ||
    props.editingProduct.description !== props.originalProduct.description ||
    props.editingProduct.price !== props.originalProduct.price ||
    props.editingProduct.expiration_date !== props.originalProduct.expiration_date ||
    props.editingProduct.categoria_id !== props.originalProduct.categoria_id ||
    props.editingProduct.image !== props.originalProduct.image
  )
})
</script>

<template>
  <div v-if="showEditModal && editingProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full">
      <h2 class="text-xl font-bold mb-4">Editar Produto</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            v-model="editingProduct.name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxlength="50"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            v-model="editingProduct.description"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxlength="200"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Preço</label>
          <input
            v-model="editingProduct.price"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
          <input
            v-model="editingProduct.expiration_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            v-model="editingProduct.categoria_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
          <input
            v-model="editingProduct.image"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="emit('update:showEditModal', false)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          :disabled="isSaving"
        >
          Cancelar
        </button>
        <button
          @click="emit('update')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          :disabled="!hasChanges || isSaving"
          :class="{ 'opacity-50 cursor-not-allowed': !hasChanges || isSaving }"
        >
          <svg
            v-if="isSaving"
            class="animate-spin h-4 w-4"
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
          <span>{{ isSaving ? 'Salvando...' : 'Salvar' }}</span>
        </button>
      </div>
    </div>
  </div>

  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Confirmar Exclusão</h2>
      <p class="text-gray-600 mb-6">
        Tem certeza que deseja excluir o produto "{{ productToDelete?.name }}"? Esta ação não pode ser desfeita.
      </p>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="emit('update:showDeleteModal', false)"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          :disabled="isDeleting"
        >
          Cancelar
        </button>
        <button
          @click="emit('delete')"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          :disabled="isDeleting"
        >
          <svg
            v-if="isDeleting"
            class="animate-spin h-4 w-4"
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
          <span>{{ isDeleting ? 'Excluindo...' : 'Excluir' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
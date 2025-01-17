import { ref } from 'vue';

export function useProducts() {
  const baseUrl = 'http://localhost:8989/api'; 
  const products = ref<Record<string, any>[]>([]);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const itemsPerPage = 10; 
  const searchTerm = ref('');
  const selectedCategory = ref('');
  const maxPrice = ref<number | null>(null);

  const addProduct = async (product: Record<string, any>) => {
    try {
      const response = await fetch(`${baseUrl}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar produto');
      }

      const data = await response.json();
      products.value.push(data); 
      return data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
      throw err;
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/produtos`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await response.json();
      products.value = data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
    }
  };

  const updateProduct = async (id: string, product: Record<string, any>) => {
    try {
      const response = await fetch(`${baseUrl}/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      const updatedProduct = await response.json();
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct; 
      }
      return updatedProduct;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/produtos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }

      products.value = products.value.filter(p => p.id !== id); 
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
      throw err;
    }
  };

  const getFilteredProducts = () => {
    return products.value.filter(product => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;
      const matchesPrice = !maxPrice.value || product.price <= maxPrice.value;
      return matchesSearchTerm && matchesCategory && matchesPrice;
    });
  };

  const paginatedProducts = () => {
    const filteredProducts = getFilteredProducts();
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = () => {
    return Math.ceil(getFilteredProducts().length / itemsPerPage);
  };

  return {
    addProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
    paginatedProducts,
    totalPages,
    currentPage,
    searchTerm,
    selectedCategory,
    maxPrice,
    error,
  };
}

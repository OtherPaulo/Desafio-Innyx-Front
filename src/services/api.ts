import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8989/api'
})

export const getCategories = async () => {
  const response = await api.get('/categorias')
  return response.data
}

export const getProducts = async (params: {
  page?: number
  search?: string
  price?: number
  categoria_id?: number
}) => {
  const response = await api.get('/produtos', { params })
  return response.data
}

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/produtos/${id}`)
  return response.data
}

export const updateProduct = async (id: number, data: {
  name?: string
  description?: string
  price?: number
  expiration_date?: string
  categoria_id?: number
  image?: string
}) => {
  const response = await api.put(`/produtos/${id}`, data)
  return response.data
}
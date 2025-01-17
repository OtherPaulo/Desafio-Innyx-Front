<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(false);
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const name = ref('');
const error = ref('');
const loading = ref(false);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  email.value = '';
  password.value = '';
  passwordConfirmation.value = '';
  name.value = '';
  error.value = '';
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (!isLogin.value && password.value.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres.');
    }
    if (!isLogin.value && password.value !== passwordConfirmation.value) {
      throw new Error('As senhas não coincidem.');
    }

    const url = isLogin.value ? 'http://localhost:8989/api/auth/login' : 'http://localhost:8989/api/auth/register';
    const payload = isLogin.value
      ? { email: email.value, password: password.value }
      : { name: name.value, email: email.value, password: password.value, password_confirmation: passwordConfirmation.value };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Ocorreu um erro inesperado.';
      throw new Error(errorMessage.replace('The password must be at least 8 characters.', 'A senha deve ter pelo menos 8 caracteres.'));
    }

    if (!isLogin.value) {
      error.value = 'Conta criada com sucesso! Você pode fazer login agora.';
      isLogin.value = true;
      email.value = '';
      password.value = '';
      passwordConfirmation.value = '';
      name.value = '';
      return;
    }

    localStorage.setItem('authToken', data.token);
    router.push('/dashboard');
  } catch (err) {
    error.value = (err as Error).message || 'Erro ao conectar com o servidor.';
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-md w-full max-w-md p-8">
      <h2 class="text-3xl font-bold text-center mb-8">
        {{ isLogin ? 'Login' : 'Criar Conta' }}
      </h2>

      <div v-if="error" :class="{'mb-6 p-4 border rounded-lg': true, 'bg-red-50 border-red-200 text-red-600': error !== 'Conta criada com sucesso! Você pode fazer login agora.', 'bg-green-50 border-green-200 text-green-600': error === 'Conta criada com sucesso! Você pode fazer login agora.'}">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="!isLogin">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div v-if="!isLogin">
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha
          </label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :class="[ 
            'w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center',
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
          :disabled="loading"
        >
          {{ loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta' }}
        </button>

        <p class="text-center text-sm text-gray-600">
          {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
          <button
            type="button"
            @click="toggleForm"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            {{ isLogin ? 'Criar conta' : 'Fazer login' }}
          </button>
        </p>
      </form>
    </div>
  </div>
</template>
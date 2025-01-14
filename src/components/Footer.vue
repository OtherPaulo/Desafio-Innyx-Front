<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-black text-white px-8 py-8">
    <div class="container px-8 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Paulo Dev</h3>
          <p class="text-gray-400">
            Transformando ideias em soluções digitais inovadoras.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Links Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Início</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Produtos</a>
            </li>
          </ul>
        </div>

        <div id="contato">
          <h3 class="text-lg font-semibold mb-4">Contato</h3>
          <ul class="space-y-2 text-gray-400">
            <li>Email: contato@paulodev.com</li>
            <li>Tel: (92) 99409-4783</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Paulo Dev. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>
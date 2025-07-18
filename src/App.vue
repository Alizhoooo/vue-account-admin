<script setup lang="ts">
import AccountManager from './components/AccountManager.vue'
</script>

<template>
  <div class="app-container">
    <AccountManager />
  </div>
</template>

<style>
/* Глобальные стили */
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
  color: #2c3e50;
}

.app-container {
  min-height: 100vh;
  padding: 20px;
}
</style>

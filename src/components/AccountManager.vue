<script setup lang="ts">
import { useAccountStore } from '../store/accountStore';
import AccountItem from './AccountItem.vue';

// Получение хранилища учетных записей
const accountStore = useAccountStore();

// Обработчик добавления новой учетной записи
const handleAddAccount = () => {
  accountStore.addAccount();
};
</script>

<template>
  <div class="account-manager">
    <!-- Заголовок и кнопка добавления -->
    <div class="header">
      <h1>Управление учетными записями</h1>
      <el-button 
        type="primary" 
        circle 
        @click="handleAddAccount"
        class="add-button"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
    
    <!-- Информация о метках -->
    <div class="labels-info">
      <el-alert
        title="Метки"
        type="info"
        description="Необязательное поле. Максимум 50 символов. Метки разделяются знаком ;"
        :closable="false"
        show-icon
      />
    </div>
    
    <!-- Список учетных записей -->
    <div v-if="accountStore.accounts.length > 0" class="accounts-list">
      <AccountItem 
        v-for="account in accountStore.accounts" 
        :key="account.id" 
        :account="account" 
      />
    </div>
    
    <!-- Сообщение, если нет учетных записей -->
    <div v-else class="no-accounts">
      <el-empty description="Нет учетных записей. Нажмите + чтобы добавить." />
    </div>
  </div>
</template>

<style scoped>
.account-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.labels-info {
  margin-bottom: 20px;
}

.accounts-list {
  margin-top: 20px;
}

.no-accounts {
  margin-top: 40px;
  text-align: center;
}
</style>
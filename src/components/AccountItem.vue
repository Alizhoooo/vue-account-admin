<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Account, AccountValidation } from '../types/account';
import { AccountType } from '../types/account';
import { useAccountStore } from '../store/accountStore';
import { ElMessage } from 'element-plus';

// Определение входных параметров
const props = defineProps<{
  account: Account;
}>();

// Получение хранилища учетных записей
const accountStore = useAccountStore();

// Локальная копия учетной записи для редактирования
const localAccount = ref<Account>({ ...props.account });

// Строковое представление меток для ввода
const labelsString = ref(accountStore.stringifyLabels(props.account.labels));

// Состояние валидации полей
const validation = ref<AccountValidation>({
  login: true,
  password: true
});

// Вычисляемое свойство для определения, нужно ли показывать поле пароля
const showPasswordField = computed(() => {
  return localAccount.value.type === AccountType.LOCAL;
});

// Вычисляемое свойство для определения, валидна ли форма
const isFormValid = computed(() => {
  // Логин обязателен всегда
  if (!localAccount.value.login.trim()) {
    return false;
  }
  
  // Пароль обязателен только для локальных учетных записей
  if (localAccount.value.type === AccountType.LOCAL && 
      (!localAccount.value.password || !localAccount.value.password.trim())) {
    return false;
  }
  
  return true;
});

// Обработчик изменения типа учетной записи
const handleTypeChange = () => {
  // Если тип LDAP, устанавливаем пароль в null
  if (localAccount.value.type === AccountType.LDAP) {
    localAccount.value.password = null;
  } else {
    // Если тип Локальная, устанавливаем пустую строку, если было null
    if (localAccount.value.password === null) {
      localAccount.value.password = '';
    }
  }
  
  validateAndSave();
};

// Обработчик изменения меток
const handleLabelsChange = () => {
  // Проверка на максимальную длину (50 символов)
  if (labelsString.value.length > 50) {
    labelsString.value = labelsString.value.substring(0, 50);
    ElMessage.warning('Максимальная длина поля метки - 50 символов');
  }
  
  // Преобразование строки меток в массив объектов
  localAccount.value.labels = accountStore.parseLabels(labelsString.value);
  validateAndSave();
};

// Обработчик изменения логина
const handleLoginChange = () => {
  // Проверка на максимальную длину (100 символов)
  if (localAccount.value.login.length > 100) {
    localAccount.value.login = localAccount.value.login.substring(0, 100);
    ElMessage.warning('Максимальная длина поля логин - 100 символов');
  }
  
  validateAndSave();
};

// Обработчик изменения пароля
const handlePasswordChange = () => {
  // Проверка на максимальную длину (100 символов)
  if (localAccount.value.password && localAccount.value.password.length > 100) {
    localAccount.value.password = localAccount.value.password.substring(0, 100);
    ElMessage.warning('Максимальная длина поля пароль - 100 символов');
  }
  
  validateAndSave();
};

// Валидация и сохранение учетной записи
const validateAndSave = () => {
  // Валидация логина
  validation.value.login = !!localAccount.value.login.trim();
  
  // Валидация пароля (только для локальных учетных записей)
  validation.value.password = localAccount.value.type === AccountType.LDAP || 
                             !!(localAccount.value.password && localAccount.value.password.trim());
  
  // Если форма валидна, сохраняем изменения
  if (isFormValid.value) {
    accountStore.updateAccount({ ...localAccount.value });
  }
};

// Обработчик удаления учетной записи
const handleDelete = () => {
  accountStore.deleteAccount(localAccount.value.id);
};

// Отслеживание изменений входного параметра account
watch(() => props.account, (newAccount) => {
  localAccount.value = { ...newAccount };
  labelsString.value = accountStore.stringifyLabels(newAccount.labels);
}, { deep: true });
</script>

<template>
  <div class="account-item">
    <!-- Форма учетной записи -->
    <el-form label-position="top" class="account-form">
      <!-- Метка -->
      <el-form-item label="Метка">
        <el-input 
          v-model="labelsString" 
          placeholder="Введите метки через ;"
          @blur="handleLabelsChange"
        >
          <template #suffix>
            <el-tooltip 
              content="Необязательное поле. Максимум 50 символов. Метки разделяются знаком ;" 
              placement="top"
            >
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
      
      <!-- Тип записи -->
      <el-form-item label="Тип записи">
        <el-select 
          v-model="localAccount.type" 
          placeholder="Выберите тип записи"
          @change="handleTypeChange"
          class="full-width"
        >
          <el-option :value="AccountType.LDAP" :label="AccountType.LDAP" />
          <el-option :value="AccountType.LOCAL" :label="AccountType.LOCAL" />
        </el-select>
      </el-form-item>
      
      <!-- Логин -->
      <el-form-item 
        label="Логин" 
        :error="!validation.login ? 'Обязательное поле' : ''"
        :class="{ 'is-error': !validation.login }"
      >
        <el-input 
          v-model="localAccount.login" 
          placeholder="Введите логин"
          @blur="handleLoginChange"
        />
      </el-form-item>
      
      <!-- Пароль (отображается только для локальных учетных записей) -->
      <el-form-item 
        v-if="showPasswordField" 
        label="Пароль"
        :error="!validation.password ? 'Обязательное поле' : ''"
        :class="{ 'is-error': !validation.password }"
      >
        <el-input 
          v-model="localAccount.password" 
          type="password"
          placeholder="Введите пароль"
          @blur="handlePasswordChange"
        />
      </el-form-item>
    </el-form>
    
    <!-- Кнопка удаления -->
    <div class="delete-button">
      <el-button 
        type="danger" 
        circle 
        @click="handleDelete"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.account-item {
  position: relative;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
}

.account-form {
  padding-right: 40px; /* Место для кнопки удаления */
}

.delete-button {
  position: absolute;
  top: 20px;
  right: 20px;
}

.full-width {
  width: 100%;
}

.is-error :deep(.el-input__inner) {
  border-color: #f56c6c;
}
</style>
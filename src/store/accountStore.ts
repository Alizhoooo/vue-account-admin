import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types/account';
import { AccountType } from '../types/account';
import { v4 as uuidv4 } from 'uuid';

/**
 * Хранилище для управления учетными записями
 */
export const useAccountStore = defineStore('account', () => {
  // Состояние - массив учетных записей
  const accounts = ref<Account[]>([]);

  // Загрузка учетных записей из localStorage при инициализации
  const initializeStore = () => {
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts);
    }
  };

  // Вызов инициализации при создании хранилища
  initializeStore();

  // Сохранение учетных записей в localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  };

  // Добавление новой учетной записи
  const addAccount = () => {
    const newAccount: Account = {
      id: uuidv4(),
      labels: [],
      type: AccountType.LOCAL,
      login: '',
      password: ''
    };
    accounts.value.push(newAccount);
    saveToLocalStorage();
    return newAccount;
  };

  // Обновление учетной записи
  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      // Если тип LDAP, устанавливаем пароль в null
      if (updatedAccount.type === AccountType.LDAP) {
        updatedAccount.password = null;
      }
      accounts.value[index] = updatedAccount;
      saveToLocalStorage();
    }
  };

  // Удаление учетной записи
  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
    saveToLocalStorage();
  };

  // Преобразование строки меток в массив объектов
  const parseLabels = (labelsString: string) => {
    if (!labelsString.trim()) return [];
    
    return labelsString
      .split(';')
      .map(label => label.trim())
      .filter(label => label.length > 0)
      .map(label => ({ text: label }));
  };

  // Преобразование массива объектов меток в строку
  const stringifyLabels = (labels: { text: string }[]) => {
    return labels.map(label => label.text).join('; ');
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    parseLabels,
    stringifyLabels
  };
});
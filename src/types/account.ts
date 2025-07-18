/**
 * Типы учетных записей
 */

// Тип записи (LDAP или Локальная)
// Используем const вместо enum для совместимости с verbatimModuleSyntax
export const AccountType = {
  LDAP: 'LDAP',
  LOCAL: 'Локальная'
} as const;

// Тип для AccountType
export type AccountTypeKeys = typeof AccountType[keyof typeof AccountType];

// Интерфейс для метки
export interface LabelItem {
  text: string;
}

// Интерфейс для учетной записи
export interface Account {
  id: string; // Уникальный идентификатор
  labels: LabelItem[]; // Массив меток
  type: AccountTypeKeys; // Тип учетной записи
  login: string; // Логин
  password: string | null; // Пароль (null для LDAP)
}

// Интерфейс для валидации полей
export interface AccountValidation {
  login: boolean;
  password: boolean;
}
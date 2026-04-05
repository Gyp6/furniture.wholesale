<h1 align="center">📜 Code Style Guide &<br> Naming Conventions</h1>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

Цей документ визначає стандарти написання коду для всієї команди. Дотримання цих правил є обов'язковим для забезпечення консистентності та високої якості продукту.

---

## 🛠 Галузеві Стандарти

Ми базуємося на наступних стандартах:
* **Base:** [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* **Angular-like (for file naming):** [Angular Style Guide](https://v19.angular.dev/style-guide)
* **Formatting:** Prettier (див. налаштування нижче)

---

## 🏗 Backend (NestJS)

### 📁 Структура та файли
* **Папки (src/*):** `one word` (наприклад: `auth`, `catalog`, `prisma`). Короткі назви.
* **Файли модулів:** `module name.suffix.ts` (наприклад: `auth.service.ts`, `user.controller.ts`). Мають чітко відображати сутність.
* **Класи:** `PascalCase` (наприклад: `class AuthService {}`).
* **Функції та змінні:** `camelCase` (наприклад: `getUserData()`, `isValid`).
* **Константи:** `UPPER_SNAKE_CASE` (наприклад: `MAX_RETRY_COUNT`).

### 🧪 Тестування
* **Unit (Vitest):** Файли називаються `*.spec.ts`.
* **E2E (Jest):** Файли називаються `*.e2e-spec.ts`.

---

## 🖼 Frontend (Next.js)

### 📁 Структура та файли
* **Папки:** `kebab-case` (наприклад: `ui`, `profile-settings`).
* **Посилання (app/\*):**. Обов'язково логічні і майже завжди повні назви: (наприклад: `p/` - bad -> `products/` - good) 
* **Компоненти (TSX):** `kebab-case`. Назва файлу = назва головного компонента (наприклад: `button.tsx`, `theme-toggle.tsx`).
* **Утиліти, Хуки, Сервіси:** `camelCase.suffix.ts` (наприклад: `useLocalStorage.hook.ts`, `formatDate.util.ts`).
* **Стилі (CSS Modules):** `PascalCase.module.css` (має відповідати назві компонента, наприклад: `Button.module.css`).

---

## 🗄 База даних (PostgreSQL + Prisma)

Схема бази даних має бути консистентною з Prisma-моделями.

* **Таблиці:** `snake_case`, **множина** (наприклад: `users`, `order_items`).
* **Колонки:** **PrismaStudio & Postgres** `snake_case`, **Code** `camelCase`, **однина** (наприклад: `email`, `created_at | createdAt`).
* **Зовнішні ключі (FK):** **PrismaStudio & Postgres** `entity_id`, **Code** `entityId` (наприклад: `user_id | userId`, `category_id | categoryId`).

---

## 🚩 Загальні правила іменування

### ✅ Boolean змінні
Мають починатися з префіксів: `is`, `has`, `can`.
> Приклад: `isActive`, `canEditPost`.

### 🔠 Абревіатури
Не пишіть абревіатури великими літерами.
* ❌ `GetUI`, `HTTPResponse`
* ✅ `GetUi`, `HttpResponse` (PascalCase) або `getUi` (camelCase)

### 🚫 Заборона "сміттєвих" назв
Офіційно **заборонено** використовувати назви `data`, `info`, `temp` для файлів та сутностей.
* ❌ `data.ts`, `info.controller.ts`
* ✅ `product.schemas.ts`, `user.metadata.ts`

---

## 🎨 Форматування та Code Style

### 🧱 Основні правила
* **Відступи:** 2 пробіли (`tabWidth: 2`).
* **Крапка з комою:** Обов'язкова (`semi: true`).
* **Лапки:** Одинарні (`singleQuote: true`) для TS/TSX та JS/JSX.
* **Об'єкти:** Пробіли всередині дужок обов'язкові.
    > `throw new RpcException({ code: 5, details: 'Invalid or expired code' });`
* **Довжина рядка:** Рекомендовано до 100-120 символів.

---

## ⚙️ Backend Configuration

### Prettier (`prettier.config.mjs`)
```javascript
/** @type {import("prettier").Config} */

export default {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: [
    'classProperties',
    'decorators-legacy',
    'typescript',
  ],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$', 
    '^../(.*)', 
    '^./(.*)'
  ],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
```

### ESLint (`eslint.config.mjs`)
```
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
```

---

## ⚙️ Frontend Configuration

### Prettier (`prettier.config.mjs`)
```javascript
/** @type {import("prettier").Config} */

export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'always',
  htmlWhitespaceSensitivity: 'ignore',
  singleAttributePerLine: true,

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: [
    'classProperties',
    'decorators-legacy',
    'typescript',
  ],
  importOrder: [
    '<THIRD_PARTY_MODULES>', 
    '^@/(.*)$', 
    '^../(.*)', 
    '^./(.*)'
  ],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
```

### ESLint (`eslint.config.mjs`)
```
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/ui/shadcn/sidebar.tsx",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
    settings: {
      // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
      // which was removed in ESLint 10 flat config. Declaring the version explicitly
      // prevents the plugin from trying to auto-detect it and failing.
      react: { version: "19" },
    },
  },
]);

export default eslintConfig;
```

---

### 💬 Коментарі та Документація
* Використовуйте JSDoc для опису публічних методів, сервісів та складних функцій.
* Коментарі мають пояснювати "Чому", а не "Що" (код має бути самодокументованим).

```
/**
* Перевіряє термін дії токена та генерує виключення, якщо він невалідний.
* @param code - унікальний код підтвердження
*/
async validateCode(code: string): Promise<void> {
  // Logic here
}
```

#### 💡 Цей гайд є "законом" репозиторію. Порушення правил веде до відхилення Pull Request.
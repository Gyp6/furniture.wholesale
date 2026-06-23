# 🛋️ Furniture.Wholesale

<div align="center">

**B2B маркетплейс меблів для бізнесів**

[Посилання](#quick-start) • [Документація](#-документація) •
[API](#-api-та-документація) • [Контакти](#-контакти)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

</div>

---

## 📋 Таблиця змісту

- [Про проект](#про-проект)
- [Основні можливості](#основні-можливості)
- [Архітектура системи](#архітектура-системи)
- [Технічний стек](#технічний-стек)
- [Вимоги для розробки](#вимоги-для-розробки)
- [Quick Start](#quick-start)
- [Структура проекту](#структура-проекту)
- [Розробка](#розробка)
- [API та документація](#-api-та-документація)
- [Contributing](#-contributing)
- [Контакти](#-контакти)
- [Ліцензія](#ліцензія)

---

## 🎯 Про проект

**Furniture.Wholesale** — це B2B маркетплейс меблів, розроблений спеціально для
бізнесів. Платформа об'єднує:

- **Продавців** (Retailers) — компанії, що покупають меблі оптом для
  перепродажу
- **Дизайнерів** (Designers) — професіонали, що планують інтер'єри та потребують
  каталогу
- **HORECA** — заклади харчування та готельного бізнесу
- **Постачальників** (Suppliers) — виробники меблів, що пропонують товари оптом

Платформа забезпечує:

- 🔐 Безпечну аутентифікацію через Better Auth та OAuth2
- 📦 Централізований каталог меблів з фільтрацією
- 🛒 Оптові замовлення з управлінням статусами
- 👥 Профілі компаній та постачальників
- 📊 Ролі та дозволи (RBAC & ABAC) для контролю доступу
- ⚡ Кешування для високої продуктивності

---

## ✨ Основні можливості

### 🔐 Аутентифікація та авторизація

- Вхід через Google (OAuth2)
- OTP верифікація за email
- Управління ролями та дозволами (CASL)
- HttpOnly куки для безпеки
- Сесії з Redis кешуванням

### 📱 Клієнтська частина (Next.js)

- Адаптивний UI на Tailwind CSS
- Компоненти з Radix UI та CVA
- Динамічна маршрутизація (Public/CRM)
- Управління станом через TanStack Query

### 🏢 Backend API (NestJS)

- RESTful API з OpenAPI/Swagger документацією
- Модульна архітектура з чіткими границями
- Transactional запити через Prisma
- Redis кешування для оптимізації
- Job Queue через BullMQ

### 🗄️ База даних

- PostgreSQL 18 для надійності та ACID транзакцій
- Prisma ORM для типобезпеки
- Міграції та версіонування схеми

### 📧 Інтеграції

- Email через Resend
- S3-сумісне сховище файлів (LocalStack для розробки)
- BullMQ для фонових операцій

---

## 🏗️ Архітектура системи

### Високорівневий огляд

```
┌─────────────────┐
│  Browser (User) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────┐
│   Next.js Frontend (Client) │  (Port 3000)
│  - Auth Pages               │
│  - CRM Pages                │
│  - API Proxy (/api/*)       │
└────────┬────────────────────┘
         │ HTTP Proxy
         ▼
┌─────────────────────────────┐
│   NestJS Backend (Server)   │  (Port 4200)
│  - Controllers              │
│  - Services                 │
│  - Guards & Interceptors    │
│  - Modules:                 │
│    • Auth                   │
│    • User                   │
│    • Company                │
│    • OTP                    │
└────────┬────────────────────┘
         │ SQL Queries
         ▼
┌──────────────────┐  ┌──────────────────┐
│  PostgreSQL 18   │  │   Redis Cache    │
│  (Port 5432)     │  │   (Port 6379)    │
└──────────────────┘  └──────────────────┘
```

### Архітектурний стиль: Модульний моноліт

Проект використовує **Модульний моноліт** як архітектурний стиль:

**Переваги:**

- ✅ ACID транзакції без складних Saga патернів
- ✅ Низька затримка (функції в пам'яті процесу)
- ✅ Спрощене налагодження та тестування
- ✅ Перспектива для масштабування (виділення мікросервісів)

**Деталі:** [Див. ADR-001-system-style.md](docs/adr/ADR-001-system-style.md)

---

## 🛠️ Технічний стек

| Рівень             | Технологія     | Версія  | Призначення                   |
| ------------------ | -------------- | ------- | ----------------------------- |
| **Frontend**       | Next.js        | 16.2.9  | React фреймворк з SSR         |
|                    | React          | 19.2.7  | UI бібліотека                 |
|                    | TypeScript     | 6.x     | Типобезпека                   |
|                    | Tailwind CSS   | 4.3.1   | CSS фреймворк                 |
|                    | Shadcn UI      | 4.11.0  | UI компоненти                 |
|                    | TanStack Query | 5.101.0 | Управління станом та запитами |
|                    | TanStack Form  | 1.33.0  | Керування формами             |
|                    | Zustand        | 5.0.14  | Управління локальним станом   |
| **Backend**        | NestJS         | 11.1.27 | Node.js фреймворк             |
|                    | TypeScript     | 6.x     | Типобезпека                   |
|                    | Prisma         | 7.8.0   | ORM для БД                    |
|                    | Better Auth    | 1.6.20  | Аутентифікація                |
|                    | CASL           | 7.0.0   | Управління дозволами          |
|                    | BullMQ         | 5.79.1  | Черга задач (Job Queue)       |
| **База даних**     | PostgreSQL     | 18.3    | Основна реляційна БД          |
|                    | Redis          | 8.2.5   | Кешування та сесії            |
| **Infrastructure** | Docker         | Latest  | Контейнеризація               |
|                    | Docker Compose | Latest  | Оркестрація контейнерів       |

---

## 🖥️ Вимоги для розробки

### Системні вимоги (Hardware)
*   **Оперативна пам'ять (RAM):** Мінімум 4 GB (рекомендовано 8 GB або більше)
*   **Процесор (CPU):** 2 ядра або більше (рекомендовано 4 ядра)
*   **Дисковий простір:** ~5 GB вільного місця (з урахуванням Docker образів)

### Обов'язкове програмне забезпечення
*   **Node.js**: `24.x` або вище
*   **bun**: `1.3.x` або вище (використовується для управління залежностями та запуску)
*   **Docker**: `24.x.x` або вище
*   **Docker Compose**: `2.x.x` або вище
*   **Git**: `2.x.x` або вище

### Перевірка встановлених версій

```bash
node --version
bun --version
docker --version
docker-compose --version
git --version
```

### Опціонально
*   **Postman**: Для ручного тестування API
*   **PgAdmin**: Для графічного керування PostgreSQL (вже вбудований у `docker-compose.prod.yaml`)
*   **VS Code**: Рекомендовано з розширеннями ESLint, Prettier, Prisma, Tailwind CSS.

---

## 🚀 Quick Start & Deployment Guide

### 1️⃣ Клонування репозиторію

```bash
git clone https://github.com/Gyp6/furniture.wholesale.git
cd furniture.wholesale
```

### 2️⃣ Встановлення залежностей

Пакетний менеджер за замовчуванням — `bun` (дозволяє значно пришвидшити встановлення).

```bash
# Встановлення залежностей у корені та у підпапках клієнта і сервера
bun install --frozen-lockfile
cd client && bun install --frozen-lockfile && cd ..
cd server && bun install --frozen-lockfile && cd ..
```

### 3️⃣ Налаштування змінних оточення (.env)

Створіть локальні файли `.env` на основі шаблонів `.env.example`:

```bash
# Копіювання конфігураційних файлів
cp server/.env.example server/.env
cp client/.env.example client/.env
cp .env.example .env
```

*Примітка: Всі критичні параметри для локального запуску за замовчуванням уже мають робочі конфігурації. Для роботи OAuth або розсилки пошти необхідно буде надати власні ключі у `server/.env`.*

### 4️⃣ Запуск локальної інфраструктури (Docker)

Переконайтеся, що Docker Daemon запущено.

```bash
# Запуск контейнерів Redis та LocalStack (імітація S3)
make env-up

# Створення бакета S3 для меблів та встановлення правил CORS
make s3-setup
make s3-cors
```

### 5️⃣ Ініціалізація та посів бази даних (PostgreSQL)

Створіть базу даних PostgreSQL локально або скористайтеся контейнером, після чого виконайте команди:

```bash
cd server

# Запуск міграцій та створення структури таблиць
bunx prisma db push

# Заповнення бази даних тестовими даними (користувачі, товари, бандли)
bunx prisma db seed

cd ..
```

### 6️⃣ Запуск у режимі розробки

Запустіть обидві частини додатку в окремих вікнах терміналу:

```bash
# Термінал 1: Backend (NestJS)
cd server && bun run dev

# Термінал 2: Frontend (Next.js)
cd client && bun run dev
```

---

### 🔍 Перевірка здоров'я (Health Check)

Коли додаток успішно запущено, сервіси доступні за адресами:
*   **Next.js Frontend:** [http://localhost:3000](http://localhost:3000)
*   **NestJS Backend API:** [http://localhost:4200/api](http://localhost:4200/api)
*   **Swagger API Docs:** [http://localhost:4200/docs/swagger](http://localhost:4200/docs/swagger)
*   **Scalar API Reference:** [http://localhost:4200/docs/scalar](http://localhost:4200/docs/scalar)
*   **PostgreSQL Port:** `5432` (доступи вказані у вашому `.env`)
*   **Redis Port:** `6379`

---

### 🔑 Тестові облікові записи (Credentials)

Після успішного запуску посіву бази даних (`db seed`), використовуйте наступні облікові записи для перевірки різних рівнів доступу та кабінетів (всі акаунти використовують пароль `Password123`):

| Роль | Email | Пароль | Опис можливостей ролі |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gyp6.sale` | `Password123` | Повне керування (зміна статусів замовлень, модерація, видалення товарів). |
| **SUPPLIER** | `supplier@gyp6.sale` | `Password123` | Постачальник меблів (додавання своїх продуктів, створення Supplier-бандлів). |
| **DESIGNER** | `designer@gyp6.sale` | `Password123` | Дизайнер інтер'єрів (доступ до CRM, збірка складних User-бандлів, шаринг). |
| **RETAILER** | `retailer@gyp6.sale` | `Password123` | Оптовий покупець (пошук меблів, оформлення замовлень, кабінет замовлень). |
| **HORECA** | `horeca@gyp6.sale` | `Password123` | Хорека |


---

### 📦 Запуск у режимі продакшену (Docker Standalone)

Для збірки та запуску всього стеку додатку в Docker-середовищі (включаючи PostgreSQL 18, Redis, LocalStack, Next.js Standalone та NestJS API) виконайте:

```bash
# Збірка front-end частини
cd client && docker buildx build --platform linux/amd64 --build-arg NEXT_PUBLIC_API_URL="http://furniture.wholesale/api/v1/" --build-arg NEXT_PUBLIC_FRONTEND_URL="http://furniture.wholesale" --build-arg NEXT_PUBLIC_BA_API_URL="http://furniture.wholesale" --build-arg NEXT_PUBLIC_BA_BASE_PATH="/api/v1/auth" --build-arg NEXT_PUBLIC_S3_URL="http://furniture.wholesale/uploads" -t furniture-web:latest -f "Dockerfile.web" --load . && cd ..

# Збірка back-end частини
cd server && docker buildx build --platform linux/amd64 -t furniture-api:latest -f "Dockerfile.api" --load . && cd ..

# Запуск продакшен контейнерів
make prod-up

# Зупинка:
make prod-down
```

---

## 📁 Структура проекту

```
furniture.wholesale/
├── client/                          # Next.js фронтенд
│   ├── app/                         # Next.js App Router (сторінки та макети)
│   │   ├── (public)/                # Публічний роут-груп
│   │   │   ├── (auth)/              # Сторінки авторизації (login, register, forgot-password)
│   │   │   └── (core)/              # Основні CRM та публічні сторінки (catalog, bundle, cart, profile, etc.)
│   │   ├── layout.tsx               # Кореневий макет
│   │   ├── globals.scss             # Глобальні SCSS стилі
│   │   └── tailwind.css             # Tailwind стилі
│   ├── src/                         # Додатковий вихідний код клієнта
│   │   ├── components/              # React компоненти (ui, layout, sections, forms, pages)
│   │   ├── config/                  # Налаштування та конфігурація
│   │   ├── constants/               # Загальні константи
│   │   ├── hooks/                   # Користувацькі React хуки
│   │   ├── lib/                     # Ініціалізація сторонніх бібліотек (auth client, axios)
│   │   ├── providers/               # React контекст-провайдери (query client, themes)
│   │   ├── services/                # API-сервіси для взаємодії з бекендом
│   │   ├── store/                   # Глобальний стейт-менеджмент (Zustand)
│   │   ├── styles/                  # Допоміжні SCSS/CSS файли
│   │   └── utils/                   # Допоміжні функції
│   ├── public/                      # Статичні ресурси (іконки, зображення)
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # NestJS бекенд
│   ├── src/                         # Вихідний код сервера
│   │   ├── main.ts                  # Точка входу додатку
│   │   ├── core/                    # Ядро системи та NestJS конфігурації
│   │   │   ├── app.module.ts        # Кореневий NestJS модуль
│   │   │   ├── application/         # Прикладний рівень (guards, interceptors, services, DTOs)
│   │   │   ├── decorators/          # Користувацькі декоратори
│   │   │   ├── infrastructure/      # Інфраструктурні NestJS хелпери (api, config, middleware, pipes)
│   │   │   └── lib/                 # Інстанси сторонніх бібліотек
│   │   ├── common/                  # Спільний код (constants, dto, enums, filters, types, utils, validators)
│   │   ├── infrastructure/          # Інфраструктурні модулі та адаптери (casl, mail, otp, prisma, redis, s3, smart-sku)
│   │   └── modules/                 # Модулі бізнес-логіки
│   │       ├── auth/                # Аутентифікація та сесії (better-auth)
│   │       ├── bundle/              # Управління бандлами (комплектами меблів)
│   │       ├── catalog/             # Каталог продуктів та категорій
│   │       ├── identity/            # Профілі користувачів та компаній (User & Company)
│   │       └── order/               # Управління оптовими замовленнями
│   ├── prisma/                      # Prisma ORM схеми та міграції
│   │   ├── schema.prisma            # Схема БД
│   │   └── migrations/              # Файли міграцій
│   ├── test/                        # Набір E2E тестів
│   ├── package.json
│   └── tsconfig.json
│
├── deploy/                          # Конфігурації для розгортання
│   ├── docker-compose.yaml          # Локальне оточення (Redis, LocalStack)
│   └── docker-compose.prod.yaml     # Продакшен стек (Next.js, NestJS, Postgres, Redis, LocalStack)
│
├── docs/                            # Архітектурна та технічна документація
│   ├── adr/                         # Architectural Decision Records (ADRs)
│   └── specs/                       # Специфікації та API-контракти
│
├── shared/                          # Спільна папка для загальних типів/констант
├── Makefile                         # Зручні команди розробника
├── package.json                     # Конфігурація кореневого проекту
├── CONTRIBUTORS.md                  # Список авторів проекту
├── LICENSE                          # Ліцензія Apache-2.0
└── README.md                        # Цей файл документації
```

---

## 🔧 Розробка

### Гайди та стандарти

Дотримуйтесь наших стандартів розробки для забезпечення якості кода:

1. **[Гайд по стилю кода](docs/specs/code-style-guide.md)** 📜
   - Конвенції іменування
   - Структура файлів
   - TypeScript та ESLint правила
   - Backend та Frontend стандарти

2. **[API контракт та специфікація](docs/specs/api-contract-&-specification.md)**
   📑
   - Таблиця ендпоїнтів
   - DTO специфікація
   - Глобальна схема помилок
   - HTTP статус коди

3. **[Архітектурні рішення](docs/adr/ADR-001-system-style.md)** 🏗️
   - Модульний моноліт
   - ACID транзакції
   - Масштабування

4. **[Потік даних](docs/specs/data-flow.md)** 🔄
   - OAuth2 сценарій
   - Створення замовлення
   - Кешування

### Лінтування та форматування

```bash
# Frontend
cd client
bun run lint      # Перевірка ESLint
bun run format    # Форматування Prettier

# Backend
cd server
bun run lint      # Перевірка ESLint
bun run format    # Форматування Prettier
```

### Запуск тестів

```bash
cd server

# Unit тести (Jest)
bun run test

# Unit тести з покриттям
bun run test:cov

# Unit тести у режимі спостереження
bun run test:watch

# E2E тести (Jest)
bun run test:e2e
```

### Prisma ORM команди

```bash
cd server

# Запустіть нову міграцію та оновіть клієнт
bunx prisma migrate dev --name describe_change

# Переглядайте дані в Prisma Studio
bunx prisma studio

# Очистіть БД та запустіть усі міграції заново
bunx prisma migrate reset

# Перевірте статус міграцій
bunx prisma migrate status
```

---

## 📚 API та документація

### Інтерактивна документація API

Коли бекенд запущений, ви можете використовувати наступні ресурси для тестування та перегляду API:
* **Swagger UI:** [http://localhost:4200/docs/swagger](http://localhost:4200/docs/swagger)
* **Scalar API Reference:** [http://localhost:4200/docs/scalar](http://localhost:4200/docs/scalar)

Всі ендпоінти задокументовані через декоратори `@nestjs/swagger` та генеруються автоматично в OpenAPI 3.0 форматі.

### Основні ендпоінти

| Метод     | Ендпоінт                       | Опис                                      | Доступ |
| --------- | ------------------------------ | ----------------------------------------- | ------ |
| **POST**  | `/api/v1/auth/sign-in/email`   | Вхід за допомогою email та пароля         | Public |
| **POST**  | `/api/v1/auth/sign-up/email`   | Реєстрація нового користувача             | Public |
| **POST**  | `/api/v1/user/verify-email`    | Верифікація email за допомогою OTP        | User   |
| **GET**   | `/api/v1/user/me`              | Отримання профілю поточного користувача   | User   |
| **GET**   | `/api/v1/products`             | Список активних товарів з фільтрацією     | Public |
| **POST**  | `/api/v1/products`             | Додавання нового товару                   | Supplier |
| **GET**   | `/api/v1/bundles/my`           | Отримання власних бандлів користувача     | User   |
| **POST**  | `/api/v1/orders`               | Створення оптового замовлення             | User   |
| **GET**   | `/api/v1/orders/my`            | Список створених замовлень поточного користувача | User |
| **PATCH** | `/api/v1/orders/{id}/status`   | Зміна статусу замовлення або субаутпуту   | Supplier/Admin |
| **GET**   | `/api/v1/company/{id}`         | Отримання деталей компанії за її ID       | Public |

**Усі ендпоінти мають префікс версіонування `/api/v1/`**

### Аутентифікація

Платформа використовує **Better Auth** для управління сесіями:

- **OAuth2**: Вхід через Google з автоматичним створенням користувача
- **Email OTP**: Верифікація email через одноразові коди
- **HttpOnly Cookies**: Токени зберігаються в захищених cookie без доступу з JavaScript
- **CASL**: Управління дозволами на основі ролей (RETAILER, DESIGNER, HORECA, SUPPLIER, ADMIN)

**Детальніше про аутентифікацію** в [API контракті](docs/specs/api-contract-&-specification.md).

### Примітка для розробників

За умовчанням, фронтенд проксує запити до API через проксі-функцію (`proxy.ts` / Next.js Middleware):

```typescript
// Запити на /api/v1/* перенаправляються на http://localhost:4200/api/v1/* (або BACKEND_URL)
```

---

## 🤝 Contributing

Ми раді бачити ваш внесок у розвиток Furniture.Wholesale!

Перш ніж почати:

1. **Створіть Fork** репозиторію
2. **Прочитайте** [CONTRIBUTORS.md](CONTRIBUTORS.md) та гайди розробки
3. **Дотримуйтесь** [Гайду по стилю кода](docs/specs/code-style-guide.md)
4. **Напишіть тести** для нових функцій
5. **Запустіть лінтер** та переконайтесь що все pass: `npm run lint`
6. **Створіть Pull Request** з детальним описанням змін

### Процес Pull Request

- Один PR = один функціонал або виправлення
- Напишіть чистий commit message: `feat: add X feature` або
  `fix: resolve Y issue`
- Посилайтесь на відповідні Issue (якщо вони існують)
- Переконайтесь що всі тести pass перед submission

### Повідомлення про помилки

Якщо ви знайшли баг:

1. **Перевірте**, чи він вже існує в
   [Issues](https://github.com/Gyp6/furniture.wholesale/issues)
2. **Створіть новий Issue** з:
   - Детальним описанням проблеми
   - Кроками для відтворення
   - Очікуваною та фактичною поведінкою
   - Версіями (Node.js, Docker, тощо)

---

## 📞 Контакти

### Команда розробки

| Роль             | Ім'я                | GitHub/Email                            |
| ---------------- | ------------------- | --------------------------------------- |
| **PM**           | Mariia Hutsuliak    |                                         |
| **Backend-Dev**  | Hrushko Maksym      | [Yanbellq](https://github.com/Yanbellq) |
| **Frontend-Dev** | Stepanyatova Sophia |                                         |
| **QA**           | Buriak Ivan         |                                         |
| **DBA**          | Maksym Koka         |                                         |

### Комунікація

- **GitHub Issues**:
  [Звітуйте про баги](https://github.com/Gyp6/furniture.wholesale/issues)
- **GitHub Discussions**:
  [Задавайте питання](https://github.com/Gyp6/furniture.wholesale/discussions)
- **Email**: За потреби, розгляньте секцію Contributing

### Ресурси

- 📖 [Документація проекту](docs/)
- 🌐 [GitHub репозиторій](https://github.com/Gyp6/furniture.wholesale)
- 📊 [Marketing Kit](docs/marketing_kit/)

---

## 📄 Ліцензія

Цей проект ліцензований під [Apache 2.0](LICENSE).

Ви можете:

- ✅ Використовувати в комерційних цілях
- ✅ Модифікувати код
- ✅ Розповсюджувати
- ✅ Приватне використання

При умові:

- 📋 Зберегти копію ліцензії та авторські права

---

## 🙏 Подяка

Спасибі всім, хто сприяє розвитку **Furniture.Wholesale**!

Проект побудований з використанням фантастичних open-source інструментів:

- [NestJS](https://nestjs.com/) - прогресивний Node.js фреймворк
- [Next.js](https://nextjs.org/) - React фреймворк
- [Prisma](https://www.prisma.io/) - ORM для Node.js і TypeScript
- [Better Auth](https://better-auth.com/) - сучасна аутентифікація
- [CASL](https://casl.js.org/) - управління дозволами
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS
- [Shadcn UI](https://ui.shadcn.com/) - accessibility-focused UI

---

<div align="center">

**Зроблено з ❤️ командою @Gyp6.sale**

[⬆ Вернутися вгору](#-furniturewholesale)

</div>

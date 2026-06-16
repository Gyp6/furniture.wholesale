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

- **Розпродавців** (Retailers) — компанії, що покупають меблі оптом для
  перепродажу
- **Дизайнерів** (Designers) — професіонали, що планують інтер'єри та потребують
  каталогу
- **HORECA** — заклади харчування та готельного бізнесу
- **Постачальників** (Suppliers) — виробники меблів, що пропонують товари оптом
- **Адміністраторів** — управління контентом, модерація, аналітика

Платформа забезпечує:

- 🔐 Безпечну аутентифікацію через Better Auth та OAuth2
- 📦 Централізований каталог меблів з фільтрацією
- 🛒 Оптові замовлення з управлінням статусами
- 👥 Профілі компаній та постачальників
- 📊 Ролі та дозволи (RBAC) для контролю доступу
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
- Queue для асинхронних операцій

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
| **Frontend**       | Next.js        | 16.2.4  | React фреймворк з SSR         |
|                    | React          | 19.2.5  | UI бібліотека                 |
|                    | TypeScript     | Latest  | Типобезпека                   |
|                    | Tailwind CSS   | Latest  | CSS фреймворк                 |
|                    | Radix UI       | Latest  | UI компоненти                 |
|                    | TanStack Query | 5.99    | Управління станом та запитами |
|                    | TanStack Form  |         | Керування формами             |
| **Backend**        | NestJS         | 11.1.19 | Node.js фреймворк             |
|                    | TypeScript     | Latest  | Типобезпека                   |
|                    | Prisma         | 7.x     | ORM для БД                    |
|                    | Better Auth    | 1.6.6   | Аутентифікація                |
|                    | CASL           | 6.8.0   | Управління дозволами          |
|                    | BullMQ         | 11.x    | Job Queue                     |
| **База даних**     | PostgreSQL     | 18      | Основна БД                    |
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
*   **Swagger API Docs:** [http://localhost:4200/docs](http://localhost:4200/docs)
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
# Збірка та запуск продакшен контейнерів
make prod-up

# Перезбірка без кешу:
make prod-rebuild

# Зупинка:
make prod-down
```

---

## 📁 Структура проекту

```
furniture.wholesale/
├── client/                          # Next.js фронтенд
│   ├── app/                         # Next.js App Router
│   │   ├── (public)/                # Публічні сторінки
│   │   │   ├── (home)/              # Головна сторінка
│   │   │   ├── auth/               # Авторизація та аутентифікація
│   │   └── (crm)/                   # Приватні сторінки (вимагають аутентифікації)
│   ├── src/
│   │   ├── components/              # React компоненти
│   │   │   ├── ui/                  # Перевикористовуємі UI компоненти
│   │   │   ├── layout/              # Компоненти макета
│   │   │   └── sections/            # Специфичні секції сторінок
│   │   ├── hooks/                   # React хуки (useLocalStorage, useQuery)
│   │   ├── lib/                     # Утиліти (auth.client.ts, utils.ts)
│   │   ├── services/                # API клієнти та сервіси
│   │   ├── store/                   # Управління станом (Zustand/Context)
│   │   ├── styles/                  # Глобальні стилі
│   │   └── utils/                   # Допоміжні функції
│   ├── public/                      # Статичні файли (изображения, іконки)
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # NestJS бекенд
│   ├── src/
│   │   ├── main.ts                  # Точка входу
│   │   ├── core/                    # Ядро додатку
│   │   │   ├── app.module.ts        # Коренева модель
│   │   │   ├── app.controller.ts    # Основний контролер
│   │   │   ├── app.service.ts       # Основний сервіс
│   │   │   ├── config/              # Конфігурація (CORS, Validation)
│   │   │   ├── decorators/          # Custom декоратори
│   │   │   ├── guards/              # Аутентифікаційні гарди
│   │   │   ├── interceptors/        # HTTP перехоплювачи
│   │   │   ├── lib/        				 # Інстанси зовнішніх бібліотек
│   │   │   ├── middleware/          # Middleware (логування)
│   │   │   ├── pipes/               # Валідаційні піпи
│   │   │   └── validators/          # Custom валідатори
│   │   ├── infrastructure/          # Інфраструктурні сервіси
│   │   │   ├── casl/                # Управління дозволами (CASL)
│   │   │   ├── mail/                # Email сервіс (Resend)
│   │   │   ├── prisma/              # Prisma конфігурація
│   │   │   └── redis/               # Redis конфігурація
│   │   ├── modules/                 # Бізнес-логіка модулів
│   │   │   ├── auth/                # Модуль аутентифікації
│   │   │   ├── user/                # Модуль користувачів
│   │   │   ├── company/             # Модуль компаній
│   │   │   └── otp/                 # Модуль OTP верифікації
│   │   └── shared/                  # Спільний код
│   │       ├── constants/           # Константи
│   │       ├── enums/               # Переліки
│   │       ├── filters/          	 # Фільтри
│   │       ├── interfaces/          # Інтерфейси
│   │       └── utils/               # Допоміжні функції
│   ├── prisma/
│   │   ├── schema.prisma            # Схема бази даних
│   │   └── migrations/              # Історія міграцій
│   ├── test/                        # E2E тести
│   │   └── app.e2e-spec.ts
│   ├── docs/
│   │   ├── swagger.json             # Згенерована OpenAPI схема
│   │   └── openapi.yaml             # OpenAPI специфікація
│   ├── package.json
│   └── tsconfig.json
│
├── deploy/                          # Docker конфігурація
│   ├── docker-compose.yaml          # Локальна розробка
│   └── docker-compose.prod.yaml     # Продакшен
│
├── docs/                            # Документація
│   ├── adr/                         # Architectural Decision Records
│   │   └── ADR-001-system-style.md  # Модульний моноліт
│   ├── sad/                         # System Architecture Documents
│   │   └── SAD-001-internal-view.md
│   └── specs/                       # Технічні специфікації
│       ├── api-contract-&-specification.md  # API контракт
│       ├── code-style-guide.md              # Гайд кодування
│       ├── data-contracts-specification.md
│       └── data-flow.md                     # Потік даних
│
├── shared/                          # Спільний пакет (типи, константи)
├── Makefile                         # Команди для розробки
├── package.json                     # Root залежності
├── CONTRIBUTORS.md                  # Список учасників
├── LICENSE                          # MIT ліцензія
└── README.md                        # Цей файл
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

Коли бекенд запущений, відвідайте
[http://localhost:4200/docs](http://localhost:4200/docs) для інтерактивної
документації Swagger.

Всі ендпоінти задокументовані через декоратори `@nestjs/swagger` та генеруються
автоматично в OpenAPI 3.0 форматі.

### Основні ендпоінти

| Метод     | Ендпоінт                  | Опис                          | Доступ |
| --------- | ------------------------- | ----------------------------- | ------ |
| **POST**  | `/api/auth/login`         | Вхід через аутентифікацію     | Public |
| **POST**  | `/api/auth/verify-otp`    | Верифікація OTP               | Public |
| **GET**   | `/api/catalog`            | Список меблів з фільтрацією   | Public |
| **POST**  | `/api/orders`             | Створення оптового замовлення | User   |
| **GET**   | `/api/orders/{id}`        | Деталі замовлення             | User   |
| **PATCH** | `/api/orders/{id}/status` | Зміна статусу замовлення      | Admin  |
| **GET**   | `/api/user/me`            | Профіль поточного користувача | User   |

**Все ендпоінти потребують префіксу `/api`**

### Аутентифікація

Платформа використовує **Better Auth** для управління сесіями:

- **OAuth2**: Вхід через Google з автоматичним створенням користувача
- **Email OTP**: Верифікація email через одноразові коди
- **HttpOnly Cookies**: Токени зберігаються в захищених cookie без доступу з
  JavaScript
- **CASL**: Управління дозволами на основі ролей (RETAILER, DESIGNER, HORECA,
  SUPPLIER, ADMIN)

**Детальніше про аутентифікацію** в
[API контракті](docs/specs/api-contract-&-specification.md).

### Примітка для розробників

За умовчанням, фронтенд має доступ до API через проксі-конфігурацію в
`next.config.ts`:

```typescript
// Запити на /api/* перенаправляються на http://localhost:4200/api
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
- 📊 [Проектна дошка](https://github.com/Gyp6/furniture.wholesale/projects)

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
- [Radix UI](https://www.radix-ui.com/) - accessibility-focused UI

---

<div align="center">

**Зроблено з ❤️ командою @Gyp6.sale**

[⬆ Вернутися вгору](#-furniturewholesale)

</div>

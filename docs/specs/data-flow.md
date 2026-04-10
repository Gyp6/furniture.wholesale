# Data Flow & Interaction Specification

| Статус | Дата | Проєкт | Стек |
| :--- | :--- | :--- | :--- |
| **Accepted** | 10.04.2026 | Furniture.Wholesale | Next.js + NestJS + Prisma |

---

## 1. Високорівнева схема (High-Level Architecture)

Взаємодія компонентів системи побудована на принципі проксіювання запитів для забезпечення безпеки та уникнення CORS-обмежень.

1.  **Frontend (Client):** Next.js додаток, що працює в Standalone режимі.
2.  **API Proxy (Next Config):** Прошарок у Next.js, що перенаправляє запити з `/api/*` на внутрішню адресу бекенду.
3.  **Backend (Server):** Монолітний NestJS додаток.
4.  **Data Layer:** PostgreSQL 18, взаємодія через Prisma ORM 7.



---

## 2. Сценарії взаємодії (Data Flow)

### Сценарій А: Авторизація через Google (OAuth2)
1.  **User:** Натискає "Увійти через Google".
2.  **Frontend:** Викликає ендпоінт `/api/auth/login/google`.
3.  **Proxy:** Передає запит на `NestJS: src/modules/auth`.
4.  **Backend (Better Auth):** Виконує обмін кодами з Google API, валідує профіль.
5.  **Infrastructure (Prisma):** Перевіряє наявність юзера в БД, створює за потреби.
6.  **Backend:** Встановлює `HttpOnly` куку з токеном сесії.
7.  **Frontend:** Отримує успішну відповідь та перенаправляє в особистий кабінет.

### Сценарій Б: Створення замовлення (Billing Module)
1.  **Frontend:** Надсилає POST запит із даними замовлення на `/api/billing/order`.
2.  **Backend (Controller):** `src/modules/billing/billing.controller.ts` приймає DTO та валідує його через `shared` валідатори.
3.  **Backend (Service):** `src/modules/billing/billing.service.ts` обробляє бізнес-логіку.
4.  **Infrastructure:** `PrismaModule` виконує транзакцію в PostgreSQL.
5.  **Response:** Бекенд повертає об'єкт замовлення, фронтенд оновлює стан (Zustand/Store).

### Сценарій В: Завантаження профілю з кешуванням
1.  **Frontend:** Запитує дані `/api/user/me`.
2.  **Backend:** `UserService` спочатку перевіряє наявність даних у **Redis** (`infrastructure/redis`).
3.  **Cache Hit:** Якщо дані є — повертає миттєво.
4.  **Cache Miss:** Якщо немає — звертається до Prisma, записує в Redis і повертає користувачу.

---

## 3. Механізм передачі даних та Statelessness

### Data Transfer Objects (DTO)
Ми використовуємо **DTO** для всіх вхідних та вихідних запитів. 
* Вхідні дані валідуються за допомогою `class-validator` у NestJS.
* Типи DTO синхронізовані через **Shared Package** або спільні інтерфейси, щоб фронтенд знав структуру відповіді.

### Принцип Statelessness (Безстанова архітектура)
* **Сервер не зберігає стан сесії в пам'яті.** Вся інформація про авторизацію міститься в сесійному токені (Cookie/JWT).
* Це дозволяє запускати декілька екземплярів бекенду за Load Balancer без ризику втрати сесії користувача.
* Всі глобальні налаштування та константи беруться з `src/shared`.

---

## 4. Схема потоку даних (Візуалізація)



**Напрямок даних:**
`User -> UI -> Proxy -> NestJS Controller -> NestJS Service -> Prisma -> DB -> Response`
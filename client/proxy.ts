import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Перехоплюємо всі запити на /api/v1/
  if (pathname.startsWith('/api/v1')) {
    
    // ВАЖЛИВО: Беремо внутрішній DNS докер-мережі. 
    // Оскільки контейнери в одному compose, 'http://backend:4200' — це найшвидший шлях!
    // Якщо не знайдено, фолбечимося на значення з .env.web
    const backendUrl = process.env.BACKEND_URL || 'http://backend:4200';

    // Формуємо новий таргет-урл (наприклад, http://backend:4200/api/v1/auth/session)
    const targetUrl = new URL(pathname + search, backendUrl);

    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

// Працює тільки для ендпоінтів API, статика та сторінки сюди не потрапляють
export const config = {
  matcher: '/api/v1/:path*',
};
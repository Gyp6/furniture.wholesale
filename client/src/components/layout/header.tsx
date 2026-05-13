'use client';

import { authClient } from '@/lib';
import { ROUTES } from '@/constants';
import { LOGO } from '@/shared/data/icons/logo';
import { Button } from "@/components/ui/shadcn/button";
import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <header className={"w-full bg-[#1A1A2E] px-8 py-4 flex items-center justify-between"}>
      <Link href={ROUTES.HOME} className={"flex items-center gap-2"}>
        <LOGO.LogoGyp6 size={32} color={"white"} className={"shrink-0"} />
        <span className={"text-white font-bold text-sm tracking-tight"}>Gyp6.sale</span>
      </Link>

      <nav className={"flex items-center gap-8"}>
        {ROUTES.NAV.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={"text-sm text-neutral-300 hover:text-white transition-colors"}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {session ? (
        <div className={"flex items-center gap-4"}>
          <button className={"text-neutral-300 hover:text-white transition-colors"}>
            <Search className={"w-4 h-4"} />
          </button>
          <button className={"text-neutral-300 hover:text-white transition-colors"}>
            <Bell className={"w-4 h-4"} />
          </button>
          <div className={"w-8 h-8 rounded-full bg-neutral-500 overflow-hidden"}>
            {session.user?.image ? (
              <img src={session.user.image} alt={"avatar"} className={"w-full h-full object-cover"} />
            ) : (
              <div className={"w-full h-full bg-neutral-600"} />
            )}
          </div>
        </div>
      ) : (
       <div className="flex items-center gap-2">
  <Button
    variant="outline"
    size="sm"
    className="rounded-full border-neutral-500 text-white bg-transparent hover:bg-white/10"
    onClick={() => router.push(ROUTES.AUTH.LOGIN)}
  >
    Login
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="rounded-full border-neutral-500 text-white bg-transparent hover:bg-white/10"
    onClick={() => router.push(ROUTES.AUTH.REGISTER)}
  >
    Sign Up
  </Button>
</div>
      )}
    </header>
  );
}
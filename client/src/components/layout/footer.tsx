export function Footer() {
  return (
    <footer
      className="w-full border-t border-neutral-100 px-10 flex items-center justify-between bg-white"
      style={{ height: '95px' }}
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        © 2026 Furnspace. All rights reserved.
      </p>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        Privacy Policy & Terms of Services
      </p>
    </footer>
  );
}
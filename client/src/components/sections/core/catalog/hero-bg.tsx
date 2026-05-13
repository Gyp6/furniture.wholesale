import { ROUTES } from '@/constants';

export function HeroBg() {
  return (
    <div className={"relative w-full h-[280px] overflow-hidden"}>
      <img
        src={ROUTES.S3('marketplace/hero-bg.png')}
        className={"absolute inset-0 w-full h-full object-cover"}
        alt={"Furniture background"}
      />
      <div className={"absolute inset-0 bg-black/20"} />
      <h1
        className={"absolute -bottom-4 w-full text-center text-white font-bold tracking-tight leading-none"}
        style={{ fontSize: 'clamp(5rem, 12vw, 10rem)' }}
      >
        Marketplace
      </h1>
    </div>
  );
}
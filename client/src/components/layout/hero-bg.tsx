import Image from 'next/image';

interface Props {
  title: string;
  image: string;
}

export function HeroBg({ title, image }: Props) {
  return (
    <div className={'relative w-full h-110 overflow-hidden'}>
      <Image
        src={image}
        className={'absolute inset-0 w-full h-full object-cover object-center'}
        alt={title}
        fill
        unoptimized
      />
      <div className={'absolute inset-0 bg-primary/40'} />
      <h1
        className={
          'absolute bottom-px w-full text-center text-white font-semibold tracking-tight text-hero leading-none'
        }
      >
        {title}
      </h1>
    </div>
  );
}

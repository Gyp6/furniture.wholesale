import Image from 'next/image';

interface Props {
  title: string;
  image?: string;
}

export function HeroBg({ title, image }: Props) {
  return (
    <div className={'relative w-full h-110 overflow-hidden bg-white'}>
      {image ? (
        <>
          <Image
            src={image}
            className={'absolute inset-0 w-full h-full object-cover object-center'}
            alt={title}
            fill
            unoptimized
          />
          <div className={'absolute inset-0 bg-primary/40'} />
        </>
      ) : null}
      <h1
        className={
          `absolute bottom-px w-full text-center font-semibold tracking-tight text-hero leading-none ${image ? 'text-white' : 'text-neutral-900'}`
        }
      >
        {title}
      </h1>
    </div>
  );
}

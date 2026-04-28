import { Icon } from '@/components/ui';
import { Button } from '@/components/ui/shadcn/button';
import { Field } from '@/components/ui/shadcn/field';

export function Social() {
  return (
    <Field className={'grid gap-4 sm:grid-cols-3'}>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
      >
        <Icon name={'AppleMonochrome'} />
        <span className={'sr-only'}>Login with Apple</span>
      </Button>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
      >
        <Icon name={'GoogleMonochrome'} />
        <span className={'sr-only'}>Login with Google</span>
      </Button>
      <Button
        variant={'outline'}
        size={'sm'}
        type={'button'}
      >
        <Icon name={'MetaMonochrome'} />
        <span className={'sr-only'}>Login with Meta</span>
      </Button>
    </Field>
  );
}

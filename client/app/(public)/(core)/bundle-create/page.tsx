import { Metadata } from 'next';
import BundleCreate from './bundle-create';

export const metadata: Metadata = {
  title: 'Bundle Create',
};

export default function BundleCreatePage() {
  return (
    <div className={'pt-20'}>
      <BundleCreate />
    </div>
  );
}

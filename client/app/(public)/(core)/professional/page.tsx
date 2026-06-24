import { Metadata } from 'next';
import SupplierProfessional from './professional';

export const metadata: Metadata = {
  title: 'Professional Dashboard',
};

export default function Professional() {
  return <SupplierProfessional />;
}

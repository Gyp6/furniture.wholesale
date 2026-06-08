import { CompanyProfilePage } from '@/components/pages/core/company/company-profile';

export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  return <CompanyProfilePage params={params} />;
}

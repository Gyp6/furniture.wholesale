import { api } from '@/lib';
import { ICompany } from '@/shared/types';

export const companyService = {
  async getById(id: string): Promise<ICompany> {
    const { data } = await api.get(`/company/${id}`);
    return data;
  },

  async getByTaxId(taxId: string): Promise<ICompany> {
    const { data } = await api.get(`/company/tax/${taxId}`);
    return data;
  },

  async updateMyCompany(dto: any): Promise<ICompany> {
    const { data } = await api.patch('/company/my', dto);
    return data;
  },

  async getLogoUploadUrl(): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const { data } = await api.post('/company/my/upload-url/logo');
    return data;
  },

  async getBannerUploadUrl(): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const { data } = await api.post('/company/my/upload-url/banner');
    return data;
  },

  async getTermsUploadUrl(): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const { data } = await api.post('/company/my/upload-url/terms');
    return data;
  },

  async uploadFileToS3(uploadUrl: string, file: File, contentType: string): Promise<void> {
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });
  },
};

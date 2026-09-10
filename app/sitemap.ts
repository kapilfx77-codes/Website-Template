import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/store/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/admin`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
    { url: `${baseUrl}/admin/inventory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.4 },
  ];
}

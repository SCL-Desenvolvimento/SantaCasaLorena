export interface HomeBanner {
  id: string;
  title: string;
  description?: string;
  desktopImageUrl: string;
  tabletImageUrl: string;
  mobileImageUrl: string;
  order: number;
  timeSeconds: number;
  createdAt: string;
  isActive: boolean;
  newsId: string;
  newsTitle: string;
}

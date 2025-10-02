export interface HomeBanner {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: 'home' | 'header' | 'sidebar' | 'footer';
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  newsId: string;
  timeSeconds: number;
  desktopImageUrl: string;
  tabletImageUrl: string;
  mobileImageUrl: string;
}
